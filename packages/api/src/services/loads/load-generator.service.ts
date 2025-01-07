import { createLoadDefinitionData } from '@space-truckers/types'
import { injectable } from 'tsyringe'
import { EntropyService } from '../gamify/entropy.service'
import { ClockSignal } from './clock-signal'
import { LoadsService } from './loads.service'

@injectable()
export class LoadGeneratorService {
  constructor(
    private tick: ClockSignal,
    private rng: EntropyService,
    private loadDb: LoadsService,
  ) {
    this.tick.subscribe(_ => this.runChanceToGenerateLoad())
  }

  runChanceToGenerateLoad() {
    this.rng.rollAction(1, 30,
      () => { this.generateLoad() },
    )
  }

  generateLoad() {
    const load = createLoadDefinitionData()
    const { key } = this.loadDb.addLoad(load)
    // console.warn('a new load was generated', key)
  }


}

