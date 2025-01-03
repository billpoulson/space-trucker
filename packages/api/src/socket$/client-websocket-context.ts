import { ConnectionAuthorizationData } from '@space-truckers/types'
import { Injectable } from 'injection-js'
import WebSocket from 'ws'
import { MQ } from '../subjects/mq'
import { AuthorizationResponseHandler } from './emitters/authorization-response-handler'
import { ClientWebsocketRelay } from './services/client-message.service'
import { CommsService, UserSocketScopedCHAT } from './services/comms.service'


@Injectable()
export class ClientWebsocketContext {

    constructor(
        authorizationResponseHandler: AuthorizationResponseHandler,
        public clientAuthorization: ConnectionAuthorizationData,
        public clientSocket: WebSocket,
        public clientSocketRelay: ClientWebsocketRelay,
        public commsService: CommsService,
        public UserSocketScopedCHAT: UserSocketScopedCHAT,
        public mq: MQ,
        // a: WebsocketMessageHandler,
        // ax: ServerTimeEmitter,
        // aa: BlockStatusEmitter
    ) {
    }
}
