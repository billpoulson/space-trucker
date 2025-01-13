import { Routes } from '@angular/router'
import { AuthGuard } from '@auth0/auth0-angular'
import { ChannelListModalActivator } from './features/components/text-chat/channel-list.modal/channel-list.modal.component'
import { DashboardPageComponent } from './features/pages/dashboard/dashboard.component'
import { TruckDashboardComponent } from './features/pages/truck-details/truck-details.component'
import { UserProfileComponent } from './features/pages/user-profile/user-profile.component'
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sandbox',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'text-chat', loadChildren: () => import('./features/components/text-chat/text-chat.module').then(m => m.TextChatModule) },
  {
    path: 'truck',
    component: TruckDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [AuthGuard]
  },
  // ...modalRoutesxx,
  {
    path: 'channel-list',
    component: ChannelListModalActivator,
    outlet: 'modal', // Auxiliary route for the modal
    resolve: {
      data: () => ({}),
      config: () => ({ width: '800px' })
    },
  },
  { path: '**', redirectTo: 'login' },
]
