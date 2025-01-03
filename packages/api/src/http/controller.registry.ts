import { AppController } from '@space-truckers/common'
import { Injectable, Injector, Provider, ReflectiveInjector } from 'injection-js'
import { BalanceController } from './controllers/balance.controller'
import { WebSocketServer } from './controllers/ws.controller'

const controllers: Provider[] = [
    WebSocketServer,
    BalanceController,
]

@Injectable()
export class ControllerInitializer extends Array<AppController> {
    constructor(
        injector: Injector,
    ) {
        const innerInjector = ReflectiveInjector.resolveAndCreate(controllers, injector)
        super(
            controllers.map(type => innerInjector.get(type))
        )
    }
}