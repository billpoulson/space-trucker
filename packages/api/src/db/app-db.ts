import { Injectable } from 'injection-js'
import { Low } from 'lowdb/lib/core/Low'
import { LoginDBSchema } from './logins.db'
export class UserInfoObject {
    constructor(
      public sub: string,
      public given_name: string,
      public family_name: string,
      public nickname: string,
      public name: string,
      public picture: string,
      public updated_at: string,
      public email: string,
      public email_verified: boolean
    ) {
    }
  }
export namespace ApplicationData {

    export class AppDbConfig {
        constructor(
            public path: string
        ) { }
    }

    @Injectable()
    export class AppDbContext {
        public loginsDB!: Low<LoginDBSchema>

        constructor(
            private config: AppDbConfig
        ) { }

        async init() {
            this.loginsDB = await LoginDBSchema.create(this.config.path)
        }
    }

    @Injectable()
    export class AppDbRepo {
        public loginsDB: Low<LoginDBSchema>

        constructor(
            appDb: ApplicationData.AppDbContext
        ) {
            this.loginsDB = appDb.loginsDB
        }
    }

    @Injectable()
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
