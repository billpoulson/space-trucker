import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AppMessageQueue } from './mq/app-message-queue';
import { EntropyService } from './services/_/entropy.service';
import { LoadConsumerService } from './services/loads/load-consumer.servicer';
import { LoadGeneratorService } from './services/loads/load-generator.service';
import { LoadsService } from './services/loads/loads.service';
import { PiracyService } from './services/loads/piracy.service';
import { ClockSignal } from './subjects/clock-signal';

@Injectable({
  providedIn: 'root',
})
export class ServiceContext {
  constructor(
    public clock: ClockSignal,
    public rng: EntropyService,
    public loadDb: LoadsService,
    public loadGenerator: LoadGeneratorService,
    public loadConsumer: LoadConsumerService,
    public piracyService: PiracyService,
    public authService: AuthService,
    public mq: AppMessageQueue
  ) {
    console.info('Service Context Started')
  }
}
