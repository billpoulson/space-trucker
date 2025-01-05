import { UserInfoObject } from '@space-truckers/types'
import { Low } from 'lowdb/lib/core/Low'
import { injectable, singleton } from 'tsyringe'
import { LoginDBSchema } from './schema/logins.db.schema'

export namespace ApplicationData {

    export class AppDbConfig {
        constructor(
            public path: string
        ) { }
    }

    @singleton()
    export class AppDbContext {
        public loginsDB!: Low<LoginDBSchema>

        constructor(
            private config: AppDbConfig
        ) { }

        async init() {
            this.loginsDB = await LoginDBSchema.create(this.config.path)
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
    }

}
