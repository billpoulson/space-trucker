import { Injectable } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { convertToKebabCase, forwardTo, isTruthy } from '@space-truckers/common'
import { SetUsernameMessage } from '@space-truckers/types'
import { BehaviorSubject, catchError, concatMap, EMPTY, first, firstValueFrom, from, interval, map, of, scan, Subject, takeUntil, tap, timeout } from 'rxjs'
import { SocketConnectionStatus } from '../../subjects/socket-connection-status'
import { NotificationService } from '../_/notification.service'
import { WebsocketService } from './web-socket.service'

const wssAuthorizeUri = (token: string) => `/wss/authorize/${token}`

@Injectable({
  providedIn: 'root'
})
export class AuthroizedWebSocketService {
  messages = new Subject<any>()
  clientMessageId = 0

  connectionStatus$ = new BehaviorSubject<boolean>(false)
  firstConnection = false;
  isAutoReconnecting = false;
  manualDisconnect = false;

  constructor(
    private websocketService: WebsocketService,
    public authService: AuthService,
    private notifyOf: NotificationService,
    socketConnectionStatus: SocketConnectionStatus,
  ) {
    this.connectionStatus$.pipe(forwardTo(socketConnectionStatus)).subscribe()
  }

  autoReconnect(username) {
    this.isAutoReconnecting = true
    const retries = 3

    interval(5000)
      .pipe(
        takeUntil(this.connectionStatus$.pipe(isTruthy())),
        scan((retries, _) => retries - 1, retries),
        concatMap(tries => from(this.connect(username, 4000))
          .pipe(
            map(() => [true, tries] as [boolean, number]),
            catchError((err) => of([false, tries] as [boolean, number])),
            tap(([connected, tries]) => {
              if (!connected) { this.notifyOf.warn(`unable to connect ${tries} attempts remaining...`, 'OK') }
            }),
          )),
        first(([connected, tries]) => connected || tries === 0)
      ).subscribe(([connected]) => {
        if (connected) {
          this.notifyOf.success('Socket Reconnected', 'OK')
        }
        else {
          this.notifyOf.error(`unable to connect after ${retries} attempts`, 'OK')
        }
      })
  }

  async connect(username: string, timeoutMs: number) {
    console.log('begin connnection....')
    const token = await firstValueFrom(this.authService.getAccessTokenSilently())

    this.websocketService
      .connect(wssAuthorizeUri(token))
      .pipe(
        catchError(() => EMPTY)
      )
      .subscribe({
        next: (message) => {
          this.firstConnection = true
          this.connectionStatus$.next(true)
          this.messages.next(message)
          console.log(message)
          this.isAutoReconnecting = false
          this.manualDisconnect = false;
        },
        error: (error) => {
          console.error('WebSocket error:', error)
          this.manualDisconnect = false;
          this.connectionStatus$.next(false)
          this.notifyOf.error('Error Connecting To Socket', 'OK')
        },
        complete: () => {
          console.log('WebSocket connection closed')
          this.connectionStatus$.next(false)
          this.notifyOf.error('Socket Closed', 'OK')

          if (this.canInitAutoReconnect()) {
            this.autoReconnect(username)
          }

        },
      })

    // this should handle the first message we receive from the socket connection
    await firstValueFrom(
      this.messages.pipe(
        timeout(timeoutMs),
        tap(authorization => {
          // log and notify connection status
          console.log('Socket Connected')
          this.notifyOf.success('Socket Connected', 'OK')
          // push the users preferred name to the server
          // this.amq.createTypedMessageInterface(SetUsernameMessage).send(username)
          this.websocketService.sendMessage({ type: convertToKebabCase(SetUsernameMessage.name), data: username })
        })
      )
    )
  }

  private canInitAutoReconnect() {
    return !this.manualDisconnect && this.firstConnection && !this.isAutoReconnecting
  }

  disconnect() {
    this.manualDisconnect = true;
    this.websocketService.disconnect()
  }
  send(obj: any) {
    obj.uuid = this.getUUID()
    this.websocketService.sendMessage(obj)
  }

  private getUUID(): any {
    return this.clientMessageId++
  }
}
