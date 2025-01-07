import { injectable } from 'tsyringe'
import { LocationCoordinates } from '../../cosmic-volume/location-coordinates'

@injectable()
export class Station {
  constructor(
    public position: LocationCoordinates
  ) { }
}