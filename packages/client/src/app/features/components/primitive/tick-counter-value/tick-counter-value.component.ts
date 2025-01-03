import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClockSignal } from '../../../../core/subjects/clock-signal';

@Component({
  selector: 'app-tick-counter-value',
  template: `<h1>{{ tick | async }} Ticks</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TickCounterValueComponent {
  constructor(
    public tick: ClockSignal
  ) { }
}
