import { ConnectionAuthorizationData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { ApplicationData } from '../../db/application-data'
import { ClientWebsocketReference } from '../../services/chat/client-web-socket-reference'
import { MQ } from '../../services/subjects/mq'


@injectable()
export class AuthorizationResponseEmitter {
  constructor(
    public authorization: ConnectionAuthorizationData,
    { send }: ClientWebsocketReference,
    ws: WebSocket,
    public mq: MQ,
    public repoImpl: ApplicationData.LoginsRepo
  ) {
    // Handle incoming messages
    ws.on('message', (message: WebSocket.RawData) => {
      try {
        console.log('socket message rcv....')
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
