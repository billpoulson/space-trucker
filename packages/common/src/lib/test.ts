
import { filter, map, Observable } from 'rxjs'
import { convertToKebabCase } from './utils'
export interface WebsocketFacade { readyState: number }
export interface MessageData<TData> { data: TData }
export type MessageConstructor<TArgs, TMessageType> = {
  new(data: TArgs): TMessageType // Constructor for instances
  type: string // Static property
  uuid?: string
}
export class AppMessageQueue {
  mq: Observable<any>

  constructor(
    private socket: any,
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

export class WebsocketService {

  private wsSubject!: WebSocket
  useWebSocket(socket: WebsocketFacade): WebsocketService {
    this.wsSubject = socket as WebSocket
    return this
  }
  connect(url: string): Observable<any> {
    return new Observable((observer) => {
      // Create a WebSocket connection
      this.wsSubject = new WebSocket(url)

      // Handle incoming messages
      this.wsSubject.onmessage = (event) => {
        observer.next(JSON.parse(event.data))
      }

      // Handle connection close
      this.wsSubject.onclose = () => {
        observer.complete()
      }

      // Handle errors
      this.wsSubject.onerror = (error) => {
        observer.error(error)
      }

      // Cleanup on unsubscribe
      return () => {
        this.wsSubject.close()
      }
    })
  }

  disconnect() {
    this.wsSubject.close(1000, 'user disconnected')
  }
  uid = 0
  sendMessage(message: any): void {
    message.uuid = this.uid++
    if (this.wsSubject && this.wsSubject.readyState === WebSocket.OPEN) {
      console.log(`sending message ${message.type}`)
      this.wsSubject.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

}
