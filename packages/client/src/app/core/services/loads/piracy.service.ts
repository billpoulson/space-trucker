import { Injectable } from '@angular/core';
import { EntropyService } from '../_/entropy.service';
import { LoadsService } from './loads.service';

import { ClockSignal } from '../../subjects/clock-signal';

@Injectable({
  providedIn: 'root',
})
export class PiracyService {
  totalStolenLoot = 0.00
  constructor(
    private tick: ClockSignal,
    private rng: EntropyService,
    private loadDb: LoadsService
  ) {
    this.tick.subscribe(_ => {
      this.rng.rollActionAsync(
        1,
        100,
        async () => { await this.runChanceToPirateLoad() }
      );
    });
  }

  async runChanceToPirateLoad() {

    const { keys, data } = this.loadDb.getEnumerableDB();

    const filteredKeys = keys.filter(key =>
      data[key].inProgress && !data[key].pirated
    );
    if (filteredKeys.length > 0) {

      const loadKey = this.rng.geRandomValueFromSet(filteredKeys);
      this.loadDb.pirateLoad(loadKey);

      const loadValue = this.loadDb.getLoadValue(loadKey);

      this.totalStolenLoot += loadValue

      console.error(`a load was pirated: $${loadValue}, total: $${this.totalStolenLoot}`);
    }
  }

}
