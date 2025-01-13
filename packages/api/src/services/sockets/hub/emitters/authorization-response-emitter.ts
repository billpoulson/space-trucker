import { MQ } from '@space-truckers/common'
import { ConnectionAuthorizationData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { LoginsRepo } from '../../../../db/login.repo'
import { ClientWebsocketReference } from '../../../chat/client-web-socket-reference'


@injectable()
export class AuthorizationResponseEmitter {
  constructor(
    public authorization: ConnectionAuthorizationData,
    { send }: ClientWebsocketReference,
    ws: WebSocket,
    public mq: MQ,
    public repoImpl: LoginsRepo
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
