import { Injectable } from '@angular/core'
import { WebsocketService as WSSCORE } from '@space-truckers/common'
import { } from '@space-truckers/types'
@Injectable({
  providedIn: 'root',
})
export class WebsocketService extends WSSCORE { }
