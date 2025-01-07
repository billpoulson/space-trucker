import { injectable } from 'tsyringe'
import { ShipPosition } from '../ship/ship-position'

@injectable()
export class Station {
  constructor(
    public position: ShipPosition
  ) {
  }
}