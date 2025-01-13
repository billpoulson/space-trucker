import { MQ, newUUID, WebsocketService } from '@space-truckers/common'
import { ConnectionAuthorizationData, UserInfoObject } from '@space-truckers/types'
import { DependencyContainer } from 'tsyringe'
import WebSocket from 'ws'
import { WSTOKEN_SEND_FN$$ } from '../../ioc/injection-tokens'
import { UserSocketChat, UserSocketChatPrompt } from '../../services/chat/user-socket-chat'
import { ClientWebsocketEntryPoint } from './client-websocket.entry-point'
import { SocketConnectionInfo } from './socket-connection-info'

export function createClientScope(
  parentScope: DependencyContainer,
  connection: SocketConnectionInfo
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
    .register(SocketConnectionInfo, { useValue: connection })
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

  return {
    scope,
    activate: () => { scope.resolve(ClientWebsocketEntryPoint) }
  }
}
