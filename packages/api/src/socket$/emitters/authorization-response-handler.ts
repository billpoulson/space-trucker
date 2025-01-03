import { ConnectionAuthorizationData } from '@space-truckers/types'
import { Injectable } from 'injection-js'
import WebSocket from 'ws'
import { ApplicationData } from '../../db/app-db'
import { MQ } from '../../subjects/mq'
import { ClientWebsocketRelay } from '../services/client-message.service'


@Injectable()
export class AuthorizationResponseHandler {
    constructor(
        public authorization: ConnectionAuthorizationData,
        { send }: ClientWebsocketRelay,
        ws: WebSocket,
        public mq: MQ,
        public repoImpl: ApplicationData.LoginsRepo
    ) {
        // Handle incoming messages
        ws.on('message', (message: WebSocket.RawData) => {
            try {
                const obj = JSON.parse(message.toString())
                mq.next(obj)
            } catch (ex: any) {
                send({
                    type: 'mq-error',
                    data: {
                        ...ex,
                        originalMessage: message
                    }
                })
            }
        })
        // Handle connection close
        ws.on('close', () => { console.log('WebSocket connection closed.') })

        send(authorization)
        repoImpl.incrementLoginCount(authorization.connectionId.toString())
    }
}
