import { UserRBAC } from '@space-truckers/common'
import { Resource, ShipModel } from '@space-truckers/types'
import { Db } from 'mongodb'
import { injectable } from 'tsyringe'
import { BaseRepository } from '../base-repository'

@injectable()
export class HeroRepository extends BaseRepository<ShipModel> {
  constructor(
    db: Db,
    rbac: UserRBAC
  ) {
    super(
      db,
      Resource.Ship,
      rbac.createResourceScopedRBAC(Resource.Ship)
    )
  }

  countOfHeroes(): Promise<number> {
    return this._collection.count({})
  }
}
