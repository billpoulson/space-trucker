import { filter, map } from 'rxjs'
import { injectable } from 'tsyringe'
import { EntropyService } from '../../gamify/entropy.service'
import { ClockSignal } from './clock-signal'
import { LoadsService } from './loads.service'


@injectable()
export class LoadConsumerService {
  constructor(
    private tick: ClockSignal,
    private rng: EntropyService,
    private loadDb: LoadsService,
  ) {
    this.tick
      .pipe(
        map(_ => this.loadDb.getEnumerableDB()),
        filter(({ keys }) => keys.length > 0)
      )
      .subscribe(({ keys, data }) => {
        const key = this.rng.geRandomValueFromSet(keys)
        if (data[key].inProgress) { return }
        // console.warn('Load bid', key)
        this.rng.rollAction(1, 10,
          () => {
            // console.warn('Load won', key)
            this.loadDb.takeLoad(key)
          })
      })
  }

}
