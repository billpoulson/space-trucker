import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AppMessageQueue } from '../../../core/mq/app-message-queue';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  @Input()
  blockCount = 0
  constructor(
    public authService: AuthService,
    public mq: AppMessageQueue,
    private cdr: ChangeDetectorRef
  ) {

    mq.select<{ data: { openBlocks: number } }>('open-blocks')
      .subscribe(({ data: { openBlocks } }) => {
        this.blockCount = openBlocks
        this.cdr.markForCheck()
      })
  }

  ngOnInit(): void {

  }
}
