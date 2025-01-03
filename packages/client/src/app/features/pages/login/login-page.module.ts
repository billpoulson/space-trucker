import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UIModule } from '../../../core/modules/ui.module';
import { CallbackComponent } from './callback/callback.component';
import { LoginPageComponent } from './login-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent }, // Default route for /login
  { path: 'callback', component: CallbackComponent }, // Route for /login/callback
];

@NgModule({
  declarations: [
    LoginPageComponent,
    CallbackComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    RouterModule.forChild(routes)
  ],

})
export class LoginPageModule { }
