import { interval, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import { LocationCoordinates } from '../../cosmic-volume/location-coordinates'
import { ShipDataContext } from '../data/ship.data-context'
import { ShipNavComputer } from './ship-nav-computer'
@injectable()
export class ShipHull {
  constructor(
    public position: LocationCoordinates,
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