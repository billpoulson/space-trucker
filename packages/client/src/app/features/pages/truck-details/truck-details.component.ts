import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  standalone: false,
  selector: 'app-truck-dashboard-page',
  templateUrl: './truck-details.component.html',
  styleUrl: './truck-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckDashboardComponent {
  constructor(
    public authService: AuthService,
  ) {
  }
}
