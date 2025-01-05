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
  users: Array<ChatUserData> = [];

  constructor() {
    merge(
      this.stream.pipe(
        concatMap((message) => from(this.users)
          .pipe(
            filter(user => user.name !== message.user),
            filter((user) => user.isSubscribedToMessage(message)),
            tap(({ send }) => {
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
    this.users.push(new ChatUserData(
      name, ws, sendJson, joinChannels
    ))
    this.users = this.users
      .filter(({ ws }) => ws.readyState === WebSocket.OPEN)
    const user = this.users.find((user) => user.name == name)!
  }

  deregister(name: string) {
    this.users = this.users
      .filter(({ ws }) => ws?.readyState === WebSocket.OPEN)
      .filter(({ name }) => name != name)

    const user = this.users.find((user) => user.name == name)!
    this.pushChannelUsersUpdate(user)
  }

  pushChannelUsersUpdate(initByUser: ChatUserData) {
    this.users
      .filter(user => user.channelSubscriptions.some(sub => initByUser.channelSubscriptions.includes(sub))) // only users subscribed to the same channel as the initByUser
      .map((user, _, users) => /* build map of users in channels*/
        [user, user.channelSubscriptions
          .reduce((state, channel) => ({
            ...state,
            [channel]: this.users.filter(peer => peer.channelSubscriptions.includes(channel)).map(({ name }) => name)
          }), {})] as [ChatUserData, any])
      .forEach(([{ send }, data]) => {
        // send user updated list of users in channels
        send({ type: convertToKebabCase(PushChannelUsersMessage.name), data })
      })
  }

  updateUsername(oldName: string, newName: string) {
    const idx = this.users.findIndex(({ name }) => name === oldName)
    this.users[idx].name = newName
    this.pushChannelUsersUpdate(this.users[idx])
  }

  isUsernameInUse(checkName: string) {
    return this.users.findIndex(({ name }) => name === checkName) > -1
  }
}

