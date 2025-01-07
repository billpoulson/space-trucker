import { injectable } from 'tsyringe'
import { ShipStatsService } from './stats/ship-stats.service'

@injectable()
export class ShipDataContext {
  constructor(
    public stats: ShipStatsService,
  ) { }
}