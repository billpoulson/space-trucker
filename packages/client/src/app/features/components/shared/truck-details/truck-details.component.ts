import { ChangeDetectionStrategy, Component } from '@angular/core'
import { getRandomInclusive } from '@space-truckers/common'

@Component({
  standalone: false,
  selector: 'app-truck-details',
  templateUrl: 'truck-details.component.html',
  styleUrls: ['./truck-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckDetailsComponent {
  truckStyle = getRandomInclusive(0,7)
 }

