import { injectable } from 'tsyringe'
import { SimulationTimeDelta } from './simulation-time-delta'
import { SimulationTimeDialation } from './simulation-time-dialation'

@injectable()
export class SimulationTime {
  private lastUpdate: number

  constructor(
    private timeDialation: SimulationTimeDialation,
    public timeDelta: SimulationTimeDelta
  ) {
    this.lastUpdate = performance.now()
  }

  Update() {
    this.timeDelta.next(this.getDelta() * this.timeDialation.getValue())
    return this.timeDelta.value
  }

  private getDelta() {
    const nextUpdate = performance.now()
    const delta = (nextUpdate - this.lastUpdate) / 1000
    this.lastUpdate = nextUpdate
    return delta
  }

}