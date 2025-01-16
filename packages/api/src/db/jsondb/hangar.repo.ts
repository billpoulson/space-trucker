import { ShipStats, UserInfoObject } from '@space-truckers/types'
import { firstValueFrom, interval, map } from 'rxjs'
import { injectable } from 'tsyringe'
import { createMockShipStats } from '../../services/sp/ship/data/mocks'

@injectable()
export class HangarRepo
// extends AppDbRepo 
{
  constructor(
    // db: AppDbContext,
    private profile: UserInfoObject,
  ) { 
    // super(db) 
  }

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
