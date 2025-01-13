import { MatTabChangeEvent } from '@angular/material/tabs'
import { IDefferedActivationCapable } from '@space-truckers/types'

export function activateSelectedTab(
  componentsByIndex: Array<IDefferedActivationCapable | undefined>,
  event: MatTabChangeEvent
) {
  componentsByIndex[event.index]?.activate?.()
}
