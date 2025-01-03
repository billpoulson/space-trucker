import { Injectable } from '@angular/core'
import { convertToKebabCase, MessageConstructor, MessageData } from '@space-truckers/common'
import { filter, map, Observable } from 'rxjs'
import { AuthroizedWebSocketService } from '../services/sockets/authorized-web-socket.service'


@Injectable({
  providedIn: 'root'
})
export class AppMessageQueue {
  mq: Observable<any>

  constructor(
    private socket: AuthroizedWebSocketService,
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
      filter(({ type }) => {
        return type === convertToKebabCase(MessageClass.name)
      }),
      map(({ data }) => {
        return data as TData
      })
    )
  }

  createTypedMessageInterface
    <TData>(
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
