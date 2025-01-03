import { ConnectionAuthorizationData } from '@space-truckers/types'
import { Injectable } from 'injection-js'
import { ClientWebsocketRelay } from '../services/client-message.service'


@Injectable()
export class BlockStatusEmitter {
    constructor(
        public connection: ConnectionAuthorizationData,
        { send }: ClientWebsocketRelay
    ) {
        // interval(1000)
        //     .pipe(
        //         startWith(0),
        //         tap(x => {
        //             send({
        //                 type: 'open-blocks',
        //                 data: { openBlocks: x }
        //             })
        //         })).subscribe()
    }
}
