import { NgModule } from '@angular/core'
import { AuthModule } from './auth/auth.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { ResumeModule } from './resume/resume.module'
import { TruckDetailsModule } from './truck-details/truck-details.module'
import { UserProfileModule } from './user-profile/user-profile.module'


const modules = [
  DashboardModule,
  ResumeModule,
  TruckDetailsModule,
  UserProfileModule,
  AuthModule
]
@NgModule({
  imports: modules,
  exports: modules
})
export class PagesModule { }
