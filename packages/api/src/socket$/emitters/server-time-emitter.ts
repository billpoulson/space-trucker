import { ConnectionAuthorizationData } from '@space-truckers/types'
import { Injectable } from 'injection-js'
import { ClientWebsocketRelay } from '../services/client-message.service'


@Injectable()
export class ServerTimeEmitter {
    constructor(
        public connection: ConnectionAuthorizationData,
        public ws: ClientWebsocketRelay
    ) {
        // interval(1000)
        //     .pipe(
        //         tap(x => {
        //             ws.send({ serverTime: + new Date() })
        //         }))
        //     .subscribe()
    }
}
