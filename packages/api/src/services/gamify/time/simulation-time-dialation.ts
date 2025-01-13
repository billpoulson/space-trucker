import { BehaviorSubject } from 'rxjs'
import { singleton } from 'tsyringe'

@singleton()
export class SimulationTimeDialation extends BehaviorSubject<number> {
  constructor() {
    super(10000)
  }
}
