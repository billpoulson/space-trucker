import {
  AppController,
  hasContent,
  isTruthy,
  trimWhitespace
} from '@space-truckers/common'
import { Request } from 'express'
import { IncomingMessage, Server } from 'http'
import { catchError, concatMap, firstValueFrom, map, of, tap, timeout } from 'rxjs'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import WebSocket from 'ws'
import { EXPRESS_SERVER$$, SCOPED_CONTAINER$$ } from '../../ioc/injection-tokens'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'
import { createClientScope } from './create-client-scope'
import { SocketConnectionInfo } from './socket-connection-info'


@singleton()
export class WebSocketServer implements AppController {
  wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>
  connections = new Map<string, SocketConnectionInfo>()

  constructor(
    @inject(EXPRESS_SERVER$$) server: Server,
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private jwtAuthService: JWTTokenAuthenticationService,
  ) {
    this.wss = new WebSocket.Server({ server })// Create WebSocket server
    this.wss.on('connection', this.tryStartClientContainer.bind(this))// Handle WebSocket connections
  }

  acceptConnectionHandler(ws: WebSocket, req: Request) {
    // try to authorize the user, and return their profile
    return of(req)
      .pipe(
        timeout(10000),// allow up to 10 seconds to accept connection
        map(req => this.getTokenFromRequest(req)),
        concatMap(token => this.jwtAuthService.tryVerifyOauthToken(token)),
        isTruthy(([allowConnection, profile]) => [allowConnection, profile]),
        map(([_, profile]) => SocketConnectionInfo.create(profile!, ws)),
        tap(connection => { this.connections.set(connection.connectionId, connection) }),
        map((conn) => createClientScope(this.scope, conn)),
        catchError((err) => {
          console.error(err)
          return of(null)
        })
      )
  }

  async tryStartClientContainer(ws: WebSocket, req: Request) {
    await firstValueFrom(this.acceptConnectionHandler(ws, req)
      .pipe(tap(container => {
        // if a container was produced, this will start the websocket for the client
        container?.activate()
      })))
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
