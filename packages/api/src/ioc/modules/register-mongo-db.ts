import { MongoDbSettings } from '@space-truckers/common'
import { Db, MongoClient } from 'mongodb'
import { DependencyContainer, FactoryProvider } from 'tsyringe'

export function registerMongoDb(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(Db)
        .registerSingleton(MongoDbSettings)
        .register(MongoDbSettings, mongoDbSettingsFactory)
        .register(Db, mongoDbFactory)
}

export const mongoDbFactory: FactoryProvider<Db> = {
    useFactory: (deps: DependencyContainer) => {
        const { connectionstring } = deps.resolve(MongoDbSettings)
        const client = new MongoClient(connectionstring, {})
        return client.db('space-truckers-db')
    }
}
export const mongoDbSettingsFactory: FactoryProvider<MongoDbSettings> = {
    useFactory: (deps: DependencyContainer) =>
        new MongoDbSettings(process.env['MONGODB_CONNECTION_STRING']!)
}