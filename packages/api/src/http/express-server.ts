import { Express } from 'express'
import { Injectable, Injector, ReflectiveInjector } from 'injection-js'
import { AppConfig } from '../server/app-config'
import { AppContainer } from '../server/app-container'
import { ControllerInitializer } from './controller.registry'

@Injectable()
export class ExpressServer {
    app: Express;
    constructor(
        private appConfig: AppConfig,
        private appContainer: AppContainer,
        { app }: AppContainer,
        private scope: Injector,
    ) {
        this.app = app;
    }

    public async bootstrap() {
        await this.appContainer.init()

        const controllersInjector = this.createControllerInjector()
        controllersInjector.get(ControllerInitializer)


    }

    createControllerInjector() {
        return ReflectiveInjector.resolveAndCreate([
            ControllerInitializer
        ], this.scope);
    }
}
