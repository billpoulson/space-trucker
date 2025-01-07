import { Vector3 } from '@space-truckers/common'
import { injectable } from 'tsyringe'

@injectable()
export class ShipPosition extends Vector3 {
  constructor() {
    super(Vector3.zero)
  }
}

