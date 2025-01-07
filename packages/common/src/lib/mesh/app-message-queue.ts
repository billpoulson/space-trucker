import { Observable, filter, map } from 'rxjs'
import { convertToKebabCase } from '../utils'
import { MessageConstructor } from './message-constructor.type'
import { MessageData } from './message-data.interface'

export class AppMessageQueue {
  mq: Observable<any>

  constructor(
    private socket: any
  ) {
    this.mq = socket.messages.pipe(
      filter(this.isMQMessage)
    )
  }

  isMQMessage(payload: any): boolean {
    return 'type' in payload && 'data' in payload
  }

  select<TModel>(actionType: string): Observable<TModel> {
    return this.mq.pipe(
      filter(({ type }) => actionType === type)
    )
  }

  selectTypedMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>
  ) {
    return this.mq.pipe(
      filter(({ type }) => type === convertToKebabCase(MessageClass.type)),
      map(({ data }) => { return data as TData })
    )
  }

  createTypedMessageInterface<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>
  ) {
    return {
      send: (data: TData) => {
        this.socket.send(
          this.createMessage(MessageClass, data)
        )
      }
    }
  }

  createMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>,
    data: TData
  ): MessageData<TData> {
    const { name } = MessageClass
    return {
      ...new MessageClass(data),
      type: convertToKebabCase(name)
    } as MessageData<TData>
  }

}
