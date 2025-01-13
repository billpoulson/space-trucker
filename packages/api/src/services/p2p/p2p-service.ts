import { P2PServiceMessageWrapper, WebRTC_ICE_Request, WebRTCConnectionAnswer, WebRTCConnectionOffer } from '@space-truckers/types'

import { completeSubject, forwardTo, MQ } from '@space-truckers/common'
import { concatMap, filter, finalize, from, map, merge, Subject, takeUntil, tap } from 'rxjs'
import { singleton } from 'tsyringe'

type ServiceMessages = WebRTCConnectionOffer | WebRTC_ICE_Request | WebRTCConnectionAnswer
interface FromConnection { _clientId: string }

export class SocketServiceConnection {
  public disconnectSignal$ = new Subject<void>

  constructor(
    public name: string,
    public ws: any,
    public peerMQ: MQ,// message queue from client to server
    public send: (message: any) => void,
  ) { }
};

@singleton()
export class P2PService {
  stream = new Subject<ServiceMessages & FromConnection>
  clients = new Map<string, SocketServiceConnection>()

  constructor() {
    merge(
      this.routeP2PMessage$()
    ).subscribe()
  }

  private routeP2PMessage$() {
    return this.stream.pipe(
      concatMap((message) => from(this.clients.entries())
        .pipe(
          filter(([_, user]) => user.name !== message._clientId),
          tap(([_, { send }]) => { send(message) })
        )
      ))
  }

  connect(
    client: SocketServiceConnection
  ) {
    const { name, peerMQ, disconnectSignal$ } = client
    console.info(`${name}: connected`)
    this.clients.set(name, client)

    peerMQ.selectTypedMessage(P2PServiceMessageWrapper)
      .pipe(
        takeUntil(disconnectSignal$),
        map(message => ({
          ...message,
          _clientId: name, // append the client id
        })),
        forwardTo(this.stream),
        finalize(() => {
          this.clients.delete(name)
        })
      )
      .subscribe()

  }

  disconnect(name: string) {
    const connection = this.clients.get(name)
    if (connection) {
      completeSubject(connection.disconnectSignal$)
    }
  }

}

