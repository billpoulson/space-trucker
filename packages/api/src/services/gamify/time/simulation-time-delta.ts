import { BehaviorSubject } from 'rxjs'
import { singleton } from 'tsyringe'

@singleton()
export class SimulationTimeDelta extends BehaviorSubject<number> {
  constructor() {
    super(0)
  }
}
