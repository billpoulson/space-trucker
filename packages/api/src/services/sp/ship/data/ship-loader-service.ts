import { LoadingState } from '@space-truckers/common'
import { ShipStats } from '@space-truckers/types'
import { Observable } from 'rxjs'
import { injectable } from 'tsyringe'
import { ShipStatsDatasource } from './stats/ship-stats.datasource'
import { ShipStatsService } from './stats/ship-stats.service'

type ShipLoaderServiceStatus = ShipStats | LoadingState

@injectable()
export class ShipLoaderService {

  constructor(
    private ax: ShipStatsDatasource,
    { data$, fetch, update }: ShipStatsService,
  ) {
  }

  public load(): Observable<ShipLoaderServiceStatus> {
    return this.ax.data$
  }

  update() {
    throw 'not implemented'
    // interval(1000).subscribe(v => {
    //   ax.update((data) => {
    //     // handle update
    //     return of(data)
    //   }, true).subscribe(x => { console.log('...............................') })
    // })
  }

}