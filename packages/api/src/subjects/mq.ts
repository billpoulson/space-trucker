import { convertToKebabCase, MessageConstructor, MessageData, WebsocketService } from '@space-truckers/common'
import { Injectable } from 'injection-js'
import { filter, map, Subject } from 'rxjs'

@Injectable()
export class MQ extends Subject<{ type: string, data: any }> {
  constructor(
    private aa: WebsocketService
  ) {
    super()
  }

  isMQMessage(payload: any): boolean {
    return 'type' in payload && 'data' in payload
  }

  // select<TModel>(actionType: string): Observable<TModel> {
  //   return this.pipe(
  //     filter(({ type }) => actionType === type)
  //   ) as Observable<TModel>
  // }

  selectTypedMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>
  ) {
    return this.pipe(
      filter(({ type }) => {
        return type === convertToKebabCase(MessageClass.name)
      }),
      map(({ type, data }) => {
        console.log(`${type} for handler ${MessageClass.name}`)
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
        this.aa.sendMessage(
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

