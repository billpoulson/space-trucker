import { filter, interval, tap } from 'rxjs'
import { singleton } from 'tsyringe'
import { ClockSignal } from './clock-signal'

@singleton()
export class TickService {
  isRunning = false;
  constructor(private signal: ClockSignal) {

    interval(10)
      .pipe(
        filter(_ => this.isRunning),
        tap(x => {
          this.signal.next(x)
        })).subscribe()

  }

  toggleClock() {
    this.isRunning = !this.isRunning
  }
}