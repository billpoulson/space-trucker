import { Inject } from 'injection-js'
import { WSTOKEN_SEND_FN$$ } from '../../types/injection-tokens'

export class ClientWebsocketRelay {
    constructor(
        @Inject(WSTOKEN_SEND_FN$$) public send: (message: any) => void,
    ) { }
}