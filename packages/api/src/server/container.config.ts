import { ReflectiveInjector } from 'injection-js'
import { createAuthModule } from '../auth/create-auth-module'
import { ApplicationData } from '../db/app-db'
import { ExpressServer } from '../http/express-server'
import { CommsService } from '../socket$/services/comms.service'
import { AppConfig } from './app-config'
import { AppContainer } from './app-container'

const { AppDbContext, AppDbConfig } = ApplicationData

export const injector = ReflectiveInjector.resolveAndCreate([
    AppConfig,
    AppContainer,
    ExpressServer,
    CommsService,
    AppDbContext,
    { provide: AppDbConfig, useValue: { path: 'db.json' } },
    ...createAuthModule()
])

export function getService<TService>(token: any, notFoundValue?: any): TService {
    return injector.get(token, notFoundValue) as TService
}