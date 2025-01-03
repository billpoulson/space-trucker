import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { DashboardPageComponent } from './features/pages/dashboard/dashboard.component';
import { LoginPageComponent } from './features/pages/login/login-page.component';
import { TruckDashboardComponent } from './features/pages/truck-details/truck-details.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'truck',
    component: TruckDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],

  },
  { path: '**', redirectTo: 'login' },
];
