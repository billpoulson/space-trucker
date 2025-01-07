import { ShipStats } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import { DataBoundObjectAdapter } from '../../../async/binding/data-bound-object-adapter'
import { IPortableDatabinding } from '../../../async/binding/portable-databinding.interface'
import { ShipStatsDatasource } from './ship-stats.datasource'

@injectable()
export class ShipStatsService
  extends DataBoundObjectAdapter<
    ShipStats,
    ShipStatsDatasource
  >
  implements IPortableDatabinding<ShipStats> {
  constructor(
    source: ShipStatsDatasource
  ) {
    return super(source) as any
  }
}


