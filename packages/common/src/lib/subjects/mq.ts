import { filter, map, Observable, Subject, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import { MessageConstructor, MessageData, WebsocketService } from '../mesh'
import { convertToKebabCase } from '../utils'

@injectable()
export class MQ extends Subject<{ type: string, uuid: string, data: any }> {

  override next(value: { type: string; uuid: string; data: any; }): void {
    super.next(value)
  }

  constructor(
    private aa: WebsocketService
  ) {
    super()
  }

  isMQMessage(payload: any): boolean {
    return 'type' in payload && 'data' in payload
  }

  selectTypedMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>
  ): Observable<TData> {
    let rxCount = -1;// number of messages received on this selector
    return this.pipe(
      filter(({ type }) => type === convertToKebabCase(MessageClass.name)),
      tap(({ uuid }) => {
        console.log(`${rxCount++} : received message ${uuid} ${convertToKebabCase(MessageClass.name)}`)
      }),
      map(({ data }) => data as TData)
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

