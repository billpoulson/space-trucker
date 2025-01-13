import { Component } from '@angular/core'
import { createComponentBem } from '../../../../core/util/bem'

@Component({
  selector: 'app-not-connected',
  templateUrl: './not-connected.component.html',
  styleUrl: './not-connected.component.scss',
  standalone: false
})
export class NotConnectedComponent {
  bem = createComponentBem('app-not-connected')
}
