import { unixTimestamp } from '@space-truckers/common'
import { ClientChatMessage, ConnectionAuthorizationData, SetUsernameError, SetUsernameMessage, SetUsernameSuccess } from '@space-truckers/types'
import { merge, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { MQ } from '../subjects/mq'
import { ChatServerService } from './chat-server-service'
import { ClientWebsocketReference } from './client-web-socket-reference'


@injectable()
export class UserSocketChat {
  currentId: string
  constructor(
    commsService: ChatServerService,
    public authInfo: ConnectionAuthorizationData,
    public socket: WebSocket,
    { send }: ClientWebsocketReference,
    mq: MQ,
  ) {
    this.currentId = `${authInfo.connectionId}`
    commsService.register(`${authInfo.connectionId}`, socket, send)
    socket.on('close', () => { commsService.deregister(`${authInfo.connectionId}`) })

    // mq.createTypedMessageInterface(ChannelsAnnounceMessage)
    //     .send({ channels: commsService.channels })

    merge(
      // set the current users preferred name
      mq.selectTypedMessage(SetUsernameMessage)
        .pipe(tap((data) => {
          if (commsService.isUsernameInUse(data)) {
            mq.createTypedMessageInterface(SetUsernameError)
              .send({ message: `"${data}" is already in use` })
            console.log('name in use')
          } else {
            commsService.updateUsername(this.currentId, data)
            this.currentId = data
            mq.createTypedMessageInterface(SetUsernameSuccess)
              .send({ message: `name updated` })
            console.log('name updated')

          }
        })),

      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(tap((data) => {
          commsService.stream.next({
            ...data,
            user: `${authInfo.connectionId}`,
            ...unixTimestamp()
          })
        }))
    ).subscribe()
  }


}
