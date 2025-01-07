import { Subject } from 'rxjs'
import { singleton } from 'tsyringe'

@singleton()
export class ClockSignal extends Subject<number> {
  constructor() {
    super();
  }
}
