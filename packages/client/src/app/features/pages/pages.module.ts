import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { TruckDetailsModule } from './truck-details/truck-details.module';
import { LoginPageModule } from './login/login-page.module';


const modules = [
  DashboardModule,
  TruckDetailsModule,
  LoginPageModule,
]
@NgModule({
  imports: modules,
  exports: modules
})
export class PagesModule { }
