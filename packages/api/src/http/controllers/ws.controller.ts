import { AppController, isTruthy, unixTimestamp, WebsocketService } from '@space-truckers/common'
import { ConnectionAuthorizationData } from '@space-truckers/types'
import { Request } from 'express'
import { Inject, Injectable, Injector, ReflectiveInjector } from 'injection-js'
import jwt from "jsonwebtoken"
import { JwksClient } from 'jwks-rsa'
import fetch from "node-fetch"
import { firstValueFrom, from, lastValueFrom, Subject, tap } from 'rxjs'
import WebSocket from 'ws'
import { ApplicationData, UserInfoObject } from '../../db/app-db'
import { AppContainer } from '../../server/app-container'
import { ClientWebsocketContext } from '../../socket$/client-websocket-context'
import { AuthorizationResponseHandler } from '../../socket$/emitters/authorization-response-handler'
import { ClientWebsocketRelay } from '../../socket$/services/client-message.service'
import { UserSocketScopedCHAT } from '../../socket$/services/comms.service'
import { MQ } from '../../subjects/mq'
import { AUTH_ISSUER$$, WSTOKEN_SEND_FN$$ } from '../../types/injection-tokens'
import { JWTVerifyOptions } from '../../types/jwt-verify-options'
const trimWhitespace = (value: string) => value.trim()
const hasContent = ({ length }) => length > 0
const configureContainerWebSocketJsonSendProvider =
    (useValue: (message: any) => void) =>
        ({ provide: WSTOKEN_SEND_FN$$, useValue })

// export class ConnectionAuthorizationData {
//     constructor(
//         public connectionId: number
//     ) {
//     }
// };

const configureAuthorizationInfoProvider = (
    connectionId: number,
    authorizationResponse: any
) => ({
    provide: ConnectionAuthorizationData,
    useValue: {
        connectionId,
        authorizationResponse
    }
})

@Injectable()
export class JWTTokenAuthenticationService {
    constructor(
        @Inject(AUTH_ISSUER$$) private issuerDomain: string,
        private client: JwksClient,
        private options: JWTVerifyOptions
    ) {
    }
    private getKey(header: any, callback: any) {
        this.client.getSigningKey(header.kid, (err, key: any) => {
            if (err) {
                callback(err, null)
                return
            }
            const signingKey = key.publicKey || key.rsaPublicKey
            callback(null, signingKey)
        })
    }

    private verifyToken(token: string): Promise<UserInfoObject> {
        const get = this.getKey.bind(this)
        return new Promise((resolve, reject) => {
            jwt.verify(token, get, this.options, async (err, decoded) => {
                this.options
                if (err) {
                    reject('Token verification failed')
                } else {
                    await fetch(
                        `https://${this.issuerDomain}/userinfo`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            resolve(data as any)
                        })

                }
            })
        })
    }

    tryAuthorizeWebsocketConnection(
        token: string
    ) {
        return from(
            new Promise<[boolean, UserInfoObject?]>(
                async (resolve) => {
                    await this.verifyToken(token)
                        .then((val) => {
                            console.log(`Connection accepted.`)
                            resolve([true, val])
                        }).catch((reason) => {
                            console.log(`Connection rejected. : ${reason}`)
                            resolve([false, undefined])
                        })
                })
        )
    }
}
@Injectable()
export class WebSocketServer implements AppController {
    nextConnectionId = 0;
    constructor(
        private scope: Injector,
        private jwtAuthService: JWTTokenAuthenticationService,
        { server }: AppContainer,
    ) {
        const {
            acceptConnection } = {
            acceptConnection: async (ws: WebSocket, req: Request) => {
                const connectionId = this.nextConnectionId++
                console.log(`New WebSocket connection opened. : ${connectionId}`)
                const websocketConnectinClose$ = new Subject<number>()
                const socketClosed$ = lastValueFrom(websocketConnectinClose$)

                const [, , token] = req.url.split('/')
                    .map(trimWhitespace)
                    .filter(hasContent)

                ws.on('close', () => {
                    websocketConnectinClose$.next(+new Date)
                    websocketConnectinClose$.complete()
                })

                const jj = firstValueFrom(await this.jwtAuthService.tryAuthorizeWebsocketConnection(token)
                    .pipe(
                        isTruthy(([allow]) => allow),
                        isTruthy(([_, profile]) => profile),
                        tap(([_, profile]) => {
                            this.createClientScopedContainer(profile!, ws, connectionId)
                        })))
            }
        }

        // Create WebSocket server
        const wss = new WebSocket.Server({ server })

        // Handle WebSocket connections
        wss.on('connection', acceptConnection)
    }

    private createClientScopedContainer(
        profile: UserInfoObject,
        ws: WebSocket,
        connectionId: number
    ) {
        const sendJson = (message: any) => ws.send(JSON.stringify(message))
        ReflectiveInjector.resolveAndCreate([
            configureAuthorizationInfoProvider(connectionId, {
                ...unixTimestamp()
            }),
            AuthorizationResponseHandler,
            { provide: UserInfoObject, useValue: profile },
            {
                provide: WebsocketService,
                useValue: new WebsocketService().useWebSocket(ws)
            },
            { provide: WebSocket, useValue: ws },
            configureContainerWebSocketJsonSendProvider(sendJson),

            ClientWebsocketRelay,
            ClientWebsocketContext,
            MQ,
            UserSocketScopedCHAT,
            ApplicationData.LoginsRepo
        ], this.scope).get(ClientWebsocketContext)
    }


}


