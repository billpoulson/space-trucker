import { completeSubject, MQ } from '@space-truckers/common'
import { ConnectionAuthorizationData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { ClientWebsocketReference } from '../chat/client-web-socket-reference'
import { SocketServiceConnection } from '../sockets/socket-service-connection'
import { P2PService } from './p2p-service'


@injectable()
export class P2PConnection {
  socketConnection: SocketServiceConnection
  constructor(
    broker: P2PService,
    public authInfo: ConnectionAuthorizationData,
    public socket: WebSocket,
    { send }: ClientWebsocketReference,
    mq: MQ,
  ) {
    this.socketConnection = new SocketServiceConnection(
      authInfo.connectionId,
      socket,
      mq,
      send
    )
    broker.connect(
      this.socketConnection
    )
    socket.on('close', () => {
      completeSubject(this.socketConnection.disconnectSignal$)
    })
  }

}
