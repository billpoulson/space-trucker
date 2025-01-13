import { convertToKebabCase } from '@space-truckers/common'
import { ClientChatMessage, ClientChatMessageData, PushChannelUsersMessage } from '@space-truckers/types'

import { ChatUserData } from '@space-truckers/types'
import { concatMap, filter, from, merge, Subject, tap } from 'rxjs'
import { singleton } from 'tsyringe'
import WebSocket from 'ws'

@singleton()
export class ChatServerService {

  channels = ['GLOBAL', 'TEST']

  stream = new Subject<ClientChatMessageData>
  clients = new Map<string, ChatUserData>()

  constructor() {
    merge(
      this.stream.pipe(
        concatMap((message) => from(this.clients.entries())
          .pipe(
            filter(([, user]) => user.name !== message.user),
            filter(([, user]) => user.isSubscribedToMessage(message)),
            tap(([, { send }]) => {
              send({
                type: convertToKebabCase(ClientChatMessage.name),
                data: message
              })
            })
          )
        )))
      .subscribe()
  }

  register(
    name: string,
    ws: WebSocket,
    sendJson: (message: any) => void
  ) {
    const joinChannels = ['GLOBAL', 'TEST']
    console.info(`${name}: connected`)
    this.clients.set(name, new ChatUserData(
      name, ws, sendJson, joinChannels
    ))
  }

  deregister(clientId: string) {
    const client = this.clients.get(clientId)!
    this.clients.delete(clientId)
    this.pushChannelUsersUpdate(client)
  }

  pushChannelUsersUpdate(initByUser: ChatUserData) {
    Array.from(this.clients.entries())
      .filter(([, user]) =>
        user.channelSubscriptions.some(sub => initByUser.channelSubscriptions.includes(sub))
      ) // only users subscribed to the same channel as the initByUser
      .map(([key, user], _,) => /* build map of users in channels*/
        [user, user.channelSubscriptions
          .reduce((state, channel) => ({
            ...state,
            [channel]: Array
              .from(this.clients.entries())
              .filter(([, peer]) => peer.channelSubscriptions.includes(channel))
              .map(([, { name }]) => name)
          }), {})] as [ChatUserData, any])
      .forEach(([{ send }, data]) => {
        send({
          type: convertToKebabCase(PushChannelUsersMessage.name),
          data
        })
      })
  }

  updateUsername(oldName: string, newName: string) {
    const aa = this.clients.get(oldName)!
    aa.name = newName

    this.pushChannelUsersUpdate(aa)
  }

  isUsernameInUse(checkName: string) {
    return Object.keys(this.channels.entries).includes(checkName)
  }
}

