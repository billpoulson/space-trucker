import { Injectable } from '@angular/core';
import { ClockSignal } from '../../subjects/clock-signal';
import { createLoadDefinitionData } from '../../system/data/load';
import { EntropyService } from '../_/entropy.service';
import { LoadsService } from './loads.service';

@Injectable({
  providedIn: 'root',
})
export class LoadGeneratorService {
  constructor(
    private tick: ClockSignal,
    private rng: EntropyService,
    private loadDb: LoadsService,
  ) {
    this.tick.subscribe(_ => {
      this.rng.rollAction(1, 30,
        () => { this.runChanceToGenerateLoad() },
      )
    })
  }

  runChanceToGenerateLoad() {
    const load = createLoadDefinitionData();
    this.loadDb.addLoad(load);
    console.warn('a new load was generated')
  }


}

