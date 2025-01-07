import { DataBoundObjectBase, IDataBoundObject } from '@space-truckers/common'
import { ShipStats } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import { ShipStatsDatasource } from './ship-stats.datasource'
@injectable()
export class ShipStatsService
  extends DataBoundObjectBase<
    ShipStats,
    ShipStatsDatasource
  >
  implements IDataBoundObject<ShipStats> {
  constructor(
    source: ShipStatsDatasource
  ) {
    return super(source) as any
  }
}


