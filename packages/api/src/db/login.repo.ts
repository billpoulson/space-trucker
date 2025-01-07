import { UserInfoObject } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import { createMockShipStats } from '../services/sp/ship/data/mocks'
import { AppDbContext } from './core/context'
import { AppDbRepo } from './core/repo'

@injectable()
export class LoginsRepo extends AppDbRepo {
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
