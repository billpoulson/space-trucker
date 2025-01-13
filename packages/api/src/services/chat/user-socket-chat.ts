import { OllamaService, unixTimestamp } from '@space-truckers/common'
import { ClientChatMessage, ConnectionAuthorizationData, SetUsernameError, SetUsernameMessage, SetUsernameSuccess, UserInfoObject } from '@space-truckers/types'
import { merge, Subject, tap, withLatestFrom } from 'rxjs'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { MQ } from '../../../../common/src/lib/subjects/mq'
import { ChatServerService } from './chat-server-service'
import { ClientWebsocketReference } from './client-web-socket-reference'


@injectable()
export class UserSocketChat {
  history: { role: string; content: string }[] = []

  constructor(
    commsService: ChatServerService,
    public authInfo: ConnectionAuthorizationData,
    public userInfo: UserInfoObject,
    public socket: WebSocket,
    { send }: ClientWebsocketReference,
    mq: MQ,
  ) {

    commsService.register(`${authInfo.connectionId}`, socket, send)
    socket.on('close', () => { commsService.deregister(`${authInfo.connectionId}`) })

    merge(
      // set the current users preferred name
      mq.selectTypedMessage(SetUsernameMessage)
        .pipe(tap((data) => {
          if (commsService.isUsernameInUse(data)) {
            mq.createTypedMessageInterface(SetUsernameError)
              .send({ message: `"${data}" is already in use` })
            console.log('name in use')
          } else {
            commsService.updateUsername(authInfo.connectionId, data)
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

@injectable()
export class UserSocketChatPrompt {
  private history: { role: string; content: string }[] = []

  constructor(
    private commsService: ChatServerService,
    private userInfo: UserInfoObject,
    private socket: WebSocket,
    private mq: MQ,
    private prompt: OllamaService
  ) {
    let aiName = new Subject<string>()
    // commsService.register(`${authInfo.connectionId}`, socket, send)
    // socket.on('close', () => { commsService.deregister(`${authInfo.connectionId}`) })

    this.generateAIBotIdentity(prompt, aiName)

    this.history.push({ role: "user", content: `keep your messages concise` })
    this.history.push({ role: "user", content: `here is some data about me | ${JSON.stringify(userInfo)}` })
    this.history.push({ role: "user", content: 'the setting is a deep-space cyber-punk space-punk dialogue' })
    this.history.push({ role: "user", content: 'you are a gritty ai space pirate character with hositle intent toward' })
    this.history.push({ role: "user", content: 'you are an ai talking to a human' })
    this.history.push({ role: "user", content: 'i won 50 ship' })
    this.history.push({ role: "user", content: 'the total value of my ships is $500000' })
    this.history.push({
      role: "assistant", content: 'i will do my best to estimate when information is not available, but i will let you know when i do'
    })
    prompt.setHistory(this.history)
    merge(
      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(
          withLatestFrom(aiName),
          tap(([data, name]) => {
            // this.history.push({ role: "user", content: data.message })
            prompt.history.push({ role: "user", content: data.message })
            let buffer = ''
            prompt.chat(
              "llama2",
              (response: string) => { buffer += response },
              () => {
                commsService.stream.next({
                  ...data,
                  user: `assistant: ${name}`,
                  ...unixTimestamp(),
                  message: buffer
                })
                this.history.push({ role: "assistant", content: buffer })
                buffer = ''
              }
            )

          }))
    ).subscribe()

  }


  private generateAIBotIdentity(prompt: OllamaService, aiName: Subject<string>) {
    let buffer = ''
    prompt.generate(
      'invent a namePlease provide your response in ONLY valid JSON format, DO NOT include conversational text ,\r,\n:  { name: string }',
      'llama2',
      (response: string) => { buffer += response },
      () => {
        try {
          buffer = buffer.replace('\r', '').replace('\n', '')
          const aa = JSON.parse(buffer)
          aiName.next(aa.name)
        } catch (err) {
          aiName.next('AL')
        }
      })
    return buffer
  }
}
