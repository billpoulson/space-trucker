import { interval, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import { ShipNavComputer } from './ship-nav-computer'
import { ShipPosition } from './ship-position'
import { ShipDataContext } from './ship.data-context'
@injectable()
export class Ship {
  constructor(
    public position: ShipPosition,
    public navComputer: ShipNavComputer,
    { stats }: ShipDataContext
  ) {
    const { data$, fetch, update } = stats
    fetch()

    interval(1000).pipe(tap(x => {
      this.navComputer.update()
    })).subscribe()
  }
}