import { singleton } from 'tsyringe'
import { ClockSignal } from './clock-signal'
import { LoadConsumerService } from './load-consumer.servicer'
import { LoadGeneratorService } from './load-generator.service'
import { LoadsService } from './loads.service'
import { PiracyService } from './piracy.service'
import { TickService } from './tick.service'

@singleton()
export class LoadsModule {
  constructor(
    public clock: ClockSignal,
    public clockController: TickService,
    public loads: LoadsService,
    public loadGenerator: LoadGeneratorService,
    public loadConsumer: LoadConsumerService,
    public piracy: PiracyService,
  ) {
    console.info(this.constructor.name)
  }
}