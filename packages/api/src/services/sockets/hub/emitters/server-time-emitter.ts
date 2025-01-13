import { ConnectionAuthorizationData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import { ClientWebsocketReference } from '../../../chat/client-web-socket-reference'


@injectable()
export class ServerTimeEmitter {
    constructor(
        public connection: ConnectionAuthorizationData,
        public ws: ClientWebsocketReference
    ) {
        // interval(1000)
        //     .pipe(
        //         tap(x => {
        //             ws.send({ serverTime: + new Date() })
        //         }))
        //     .subscribe()
    }
}
