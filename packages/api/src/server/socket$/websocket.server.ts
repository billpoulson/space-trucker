import {
  AppController,
  hasContent,
  isTruthy,
  MQ,
  trimWhitespace,
  WebsocketService
} from '@space-truckers/common'
import { ConnectionAuthorizationData, UserInfoObject } from '@space-truckers/types'
import { Request } from 'express'
import { IncomingMessage, Server } from 'http'
import { catchError, EMPTY, firstValueFrom, lastValueFrom, map, Subject, timeout } from 'rxjs'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import WebSocket from 'ws'
import { EXPRESS_SERVER$$, SCOPED_CONTAINER$$, WSTOKEN_SEND_FN$$ } from '../../ioc/injection-tokens'
import { UserSocketChat } from '../../services/chat/user-socket-chat'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'
import { ClientWebsocketEntryPoint } from './client-websocket.entry-point'

@singleton()
export class WebSocketServer implements AppController {
  nextConnectionId = 0
  wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>
  constructor(
    @inject(EXPRESS_SERVER$$) server: Server,
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private jwtAuthService: JWTTokenAuthenticationService,
  ) {
    // Create WebSocket server
    this.wss = new WebSocket.Server({ server })
    // Handle WebSocket connections
    this.wss.on('connection', this.acceptConnectionHandler.bind(this))
  }

  private createClientScopedContainer(
    profile: UserInfoObject,
    ws: WebSocket,
    connectionId: number,
  ) {
    let clientMessageId = 0
    const generateNextUUID = () => ({ uuid: clientMessageId++ })

    return this.scope
      .createChildContainer()
      .registerSingleton(MQ)
      .registerSingleton(ConnectionAuthorizationData)
      .registerSingleton(WebSocket)
      .registerSingleton(UserInfoObject)
      .registerSingleton(WebsocketService)
      .registerSingleton(UserSocketChat)
      .registerSingleton(ClientWebsocketEntryPoint)
      .register(ConnectionAuthorizationData, { useValue: { connectionId } })
      .register(WebSocket, { useValue: ws })
      .register(UserInfoObject, { useValue: profile })
      .register(WebsocketService, { useValue: new WebsocketService().useWebSocket(ws), })
      .register(WSTOKEN_SEND_FN$$, {
        useValue: (message: any) =>
          ws.send(JSON.stringify({
            ...message,
            ...generateNextUUID()// append a uuid to every message
          }))
      })

  }

  async acceptConnectionHandler(ws: WebSocket, req: Request) {
    const connectionId = this.nextConnectionId++
    console.log(`New WebSocket connection opened. : ${connectionId}`)
    const websocketConnectinClose$ = new Subject<number>()
    const socketClosed$ = lastValueFrom(websocketConnectinClose$)

    const token = this.getTokenFromRequest(req)

    ws.on('close', () => {
      websocketConnectinClose$.next(+new Date())
      websocketConnectinClose$.complete()
    })

    // try to authorize the user, and return their profile
    const container = await firstValueFrom(
      this.jwtAuthService.tryVerifyOauthToken(token)
        .pipe(
          isTruthy(([allow]) => allow),
          isTruthy(([_, profile]) => profile),
          map(([_, profile]) => this.createClientScopedContainer(profile!, ws, connectionId)),
        ).pipe(
          timeout(3000),
          catchError(_ => EMPTY)
        ),
    )

    // if a container was produced, this will start the websocket for the client
    container?.resolve(ClientWebsocketEntryPoint)
  }

  private getTokenFromRequest(req): string {
    const [base, action, token] = req.url
      .split('/')
      .map(trimWhitespace)
      .filter(hasContent)

    if (base == 'wss' && action == 'authorize') return token

    throw 'invalid connection attempt'
  }
}
