import { Injectable } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { AppMessageQueue } from './mq/app-message-queue'
import { EntropyService } from './services/_/entropy.service'
import { ClockSignal } from './subjects/clock-signal'

@Injectable({
  providedIn: 'root',
})
export class ServiceContext {
  constructor(
    public clock: ClockSignal,
    public rng: EntropyService,
    public authService: AuthService,
    public mq: AppMessageQueue
  ) {
    console.info('Service Context Started')
  }
}
