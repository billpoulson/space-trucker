import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TickService } from '../../../../../core/services/_/tick.service'
import { ClockSignal } from '../../../../../core/subjects/clock-signal'

@Component({
  selector: 'app-clock-toggle',
  standalone: false,
  template: `
    <button mat-stroked-button color="primary" (click)="tick.toggleClock()" >
      <mat-icon>{{getIcon()}}</mat-icon> {{ getText() }}
    </button>
  `,
  styleUrls: ['./clock-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockToggleComponent {
  constructor(
    public signal: ClockSignal,
    public tick: TickService
  ) {
    this.signal.subscribe(x => { console.log('running', x) })
  }

  toggleClock = () => this.tick.toggleClock();
  getText = () => this.tick.isRunning ? 'Pause' : 'Resume'
  getIcon = () => this.tick.isRunning ? 'pause' : 'play_arrow'
}

