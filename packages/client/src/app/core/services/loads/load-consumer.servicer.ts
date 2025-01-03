import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import { ClockSignal } from '../../subjects/clock-signal';
import { EntropyService } from '../_/entropy.service';
import { LoadsService } from './loads.service';


@Injectable({
  providedIn: 'root',
})
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
        const k = this.rng.geRandomValueFromSet(keys)
        if (data[k].inProgress) { return }
        console.warn('Load Target', k)
        this.rng.rollAction(1, 10,
          () => {
            this.loadDb.takeLoad(k)
            console.warn('Load Consumed', k)
          })
      })
  }

}
