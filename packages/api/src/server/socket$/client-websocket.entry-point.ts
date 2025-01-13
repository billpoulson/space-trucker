import { injectable } from 'tsyringe'
import { ChatServerService } from '../../services/chat/chat-server-service'
import { UserSocketChat, UserSocketChatPrompt } from '../../services/chat/user-socket-chat'
import { P2PConnection } from '../../services/p2p/p2p-connection'
import { AuthorizationResponseEmitter } from './emitters/authorization-response-emitter'

@injectable()
export class ClientWebsocketEntryPoint {
    constructor(
        public authorizationResponseHandler: AuthorizationResponseEmitter,
        public commsService: ChatServerService,
        public UserSocketScopedCHAT: UserSocketChat,
        public p2p: P2PConnection,
        public promptCompanion: UserSocketChatPrompt
    ) { }
}
