import { Injectable } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { convertToKebabCase, forwardTo, isTruthy } from '@space-truckers/common'
import { SetUsernameMessage } from '@space-truckers/types'
import { BehaviorSubject, first, firstValueFrom, interval, scan, Subject, takeUntil, tap } from 'rxjs'
import { SocketConnectionStatus } from '../../subjects/socket-connection-status'
import { NotificationService } from '../_/notification.service'
import { WebsocketService } from './web-socket.service'

const wssAuthorizeUri = (token: string) => `/wss/authorize/${token}`

@Injectable({
  providedIn: 'root'
})
export class AuthroizedWebSocketService {
  messages = new Subject<any>()
  connectionStatus$ = new BehaviorSubject<boolean>(false)
  firstConnection = false;
  isAutoReconnecting = false;
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
    interval(3000)
      .pipe(
        takeUntil(this.connectionStatus$.pipe(isTruthy())),
        scan((retries, _) => retries - 1, retries),
        tap(x => {
          this.connect(username)
        }),
        first(tries => tries === 0)
      ).subscribe()
  }

  async connect(username: string) {
    const token = await firstValueFrom(this.authService.getAccessTokenSilently())

    this.websocketService
      .connect(wssAuthorizeUri(token))
      .subscribe({
        next: (message) => {
          this.firstConnection = true
          this.connectionStatus$.next(true)
          this.messages.next(message)
          console.log(message)
          this.isAutoReconnecting = false
        },
        error: (error) => {
          console.error('WebSocket error:', error)
          this.connectionStatus$.next(false)
          this.notifyOf.error('Error Connecting To Socket', 'OK')
        },
        complete: () => {
          console.log('WebSocket connection closed')
          this.connectionStatus$.next(false)
          this.notifyOf.error('Socket Closed', 'OK')
          if (this.firstConnection && !this.isAutoReconnecting) {
            this.autoReconnect(username)
          }
        },
      })

    // this should handle the first message we receive from the socket connection
    await firstValueFrom(
      this.messages.pipe(
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

  disconnect() {
    this.websocketService.disconnect()
  }

  send(obj: any) {
    this.websocketService.sendMessage(obj)
  }
}
