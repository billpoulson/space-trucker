import { MQ, newUUID, WebsocketService } from '@space-truckers/common'
import { ConnectionAuthorizationData, UserInfoObject } from '@space-truckers/types'
import { DependencyContainer } from 'tsyringe'
import WebSocket from 'ws'
import { ClientWebsocketEntryPoint } from '../../server/socket$/client-websocket.entry-point'
import { UserSocketChat, } from '../../services/chat/user-socket-chat'
import { UserSocketChatPrompt } from '../../services/chat/user-socket-chat-prompt'
import { ClientWebsocketConnectionInstance } from '../../services/sockets/socket-connection-info'
import { WSTOKEN_SEND_FN$$ } from '../injection-tokens'
import { registerUserRBACContainer } from '../modules/register-rbac-container'

export function createClientScope(
  parentScope: DependencyContainer,
  connection: ClientWebsocketConnectionInstance
) {
  const { connectionId, socket, profile } = connection

  const scope = parentScope
    .createChildContainer()
    .registerSingleton(MQ)
    .registerSingleton(ConnectionAuthorizationData)
    .registerSingleton(WebSocket)
    .registerSingleton(UserInfoObject)
    .registerSingleton(WebsocketService)
    .registerSingleton(UserSocketChat)
    .registerSingleton(UserSocketChatPrompt)
    .registerSingleton(ClientWebsocketEntryPoint)
    .register(ClientWebsocketConnectionInstance, { useValue: connection })
    .register(ConnectionAuthorizationData, { useValue: { connectionId } })
    .register(WebSocket, { useValue: socket })
    .register(UserInfoObject, { useValue: profile })
    .register(WebsocketService, WebsocketService.createProvider(socket))
    .register(WSTOKEN_SEND_FN$$, {
      useValue: (message: any) => socket.send(JSON.stringify({
        ...message,
        ...{ uuid: newUUID() } // append a uuid to every message
      }))
    })
    
  registerUserRBACContainer(scope)

  return {
    scope,
    activate: () => { scope.resolve(ClientWebsocketEntryPoint) }
  }
}
