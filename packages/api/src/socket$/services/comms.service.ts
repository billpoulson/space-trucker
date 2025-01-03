import { convertToKebabCase } from '@space-truckers/common'
import { ClientChatMessage, ClientChatMessageData, PushChannelUsersMessage, SetUsernameError, SetUsernameMessage, SetUsernameSuccess } from '@space-truckers/types'

import { unixTimestamp } from '@space-truckers/common'
import { ChatUserData, ConnectionAuthorizationData } from '@space-truckers/types'
import { Injectable } from 'injection-js'
import { concatMap, filter, from, merge, Subject, tap } from 'rxjs'
import WebSocket from 'ws'
import { MQ } from '../../subjects/mq'
import { ClientWebsocketRelay } from './client-message.service'

@Injectable()
export class CommsService {

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

@Injectable()
export class UserSocketScopedCHAT {
    currentId: string
    constructor(
        commsService: CommsService,
        public authInfo: ConnectionAuthorizationData,
        public socket: WebSocket,
        { send }: ClientWebsocketRelay,
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
                    console.log('handle SetUsernameMessage')
                    if (commsService.isUsernameInUse(data)) {
                        mq.createTypedMessageInterface(SetUsernameError)
                            .send({ message: `"${data}" is already in use` })
                    } else {
                        commsService.updateUsername(this.currentId, data)
                        this.currentId = data
                        mq.createTypedMessageInterface(SetUsernameSuccess)
                            .send({ message: `name updated` })
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
