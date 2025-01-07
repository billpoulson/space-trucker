import { Observable } from 'rxjs'
import { WebsocketFacade } from './websocket.facade'

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
  uid = 0;
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
