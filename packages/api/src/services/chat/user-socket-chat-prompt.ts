import { MQ, OllamaService, unixTimestamp } from '@space-truckers/common'
import { ClientChatMessage, UserInfoObject } from '@space-truckers/types'
import { from, merge, Subject, tap, withLatestFrom } from 'rxjs'
import { injectable } from 'tsyringe'
import { ChatServerService } from './chat-server-service'

@injectable()
export class UserSocketChatPrompt {

  constructor(
    commsService: ChatServerService,
    userInfo: UserInfoObject,
    // private socket: WebSocket,
    mq: MQ,
    prompt: OllamaService
  ) {
    let aiName = new Subject<string>()

    

    prompt.setHistory([
      { role: "user", content: `keep your messages concise` },
      { role: "user", content: `here is some data about me | ${JSON.stringify(userInfo)}` },
      { role: "user", content: 'the setting is a deep-space cyber-punk space-punk dialogue' },
      { role: "user", content: 'you are a gritty ai space pirate character with hositle intent toward' },
      { role: "user", content: 'you are an ai talking to a human' },
      { role: "user", content: 'i won 50 ship' },
      { role: "user", content: 'the total value of my ships is $500000' },
      {
        role: "assistant",
        content: 'i will do my best to estimate when information is not available, but i will let you know when i do'
      }])

    merge(
      from(this.generateAIBotIdentity(prompt, aiName)),
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
                prompt.history.push({ role: "assistant", content: buffer })
                commsService.stream.next({
                  ...data,
                  user: `assistant: ${name}`,
                  ...unixTimestamp(),
                  message: buffer
                })
                buffer = ''
              }
            )

          }))
    ).subscribe()

  }


  private async generateAIBotIdentity(prompt: OllamaService, aiName: Subject<string>) {
    let buffer = ''
    await prompt.generate(
      'invent a name, Please provide your response in ONLY valid JSON format, DO NOT include conversational text ,\r,\n:  { name: string }',
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
