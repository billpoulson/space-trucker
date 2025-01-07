import { ShipStats, UserInfoObject } from '@space-truckers/types'
import { Low } from 'lowdb/lib/core/Low'
import { firstValueFrom, interval, map } from 'rxjs'
import { injectable, singleton } from 'tsyringe'
import { createMockShipStats } from '../services/sp/ship/mocks'
import { LoginDBSchema } from './schema/logins.db.schema'

export namespace ApplicationData {

    export class AppDbConfig {
        constructor(
            public path: string
        ) { }
    }

    @singleton()
    export class AppDbContext {
        isInitialized = false
        public loginsDB!: Low<LoginDBSchema>

        constructor(
            private config: AppDbConfig
        ) { }

        async init() {
            this.loginsDB = await LoginDBSchema.create(this.config.path)
            this.isInitialized = true
        }
    }

    @singleton()
    export class AppDbRepo {
        public loginsDB: Low<LoginDBSchema>

        constructor(
            appDb: ApplicationData.AppDbContext
        ) {
            this.loginsDB = appDb.loginsDB
        }
    }

    @injectable()
    export class LoginsRepo extends ApplicationData.AppDbRepo {
        constructor(
            db: AppDbContext,
            private profile: UserInfoObject,
        ) { super(db) }

        async incrementLoginCount(userId: string) {
            return this.loginsDB.update(({ message }) => {
                message.push(
                    `new login ${userId} ${this.profile.sub} @ ${+new Date}`
                )
            })
        }
        async getShip() {
            return createMockShipStats()
        }
    }

    @injectable()
    export class HangarRepo extends ApplicationData.AppDbRepo {
        constructor(
            db: AppDbContext,
            private profile: UserInfoObject,
        ) { super(db) }

        getShip(): Promise<ShipStats> {
            return Promise.resolve(createMockShipStats())
        }
        getRandomNumber(): Promise<number> {
            return firstValueFrom(
                interval(5000).pipe(
                    map(x => +new Date % 2)
                )
            )
        }
    }
}
