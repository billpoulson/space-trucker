import { MQ } from '@space-truckers/common'
import { ConnectionAuthorizationData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { ChatServerService } from '../../services/chat/chat-server-service'
import { ClientWebsocketReference } from '../../services/chat/client-web-socket-reference'
import { UserSocketChat } from '../../services/chat/user-socket-chat'
import { AuthorizationResponseEmitter } from './emitters/authorization-response-emitter'

@injectable()
export class ClientWebsocketEntryPoint {
    constructor(
        public authorizationResponseHandler: AuthorizationResponseEmitter,
        public clientAuthorization: ConnectionAuthorizationData,
        public clientSocket: WebSocket,
        public clientSocketRelay: ClientWebsocketReference,
        public commsService: ChatServerService,
        public UserSocketScopedCHAT: UserSocketChat,
        public mq: MQ,
    ) { }
}
