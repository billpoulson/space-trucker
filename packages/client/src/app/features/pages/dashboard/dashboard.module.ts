import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { DashboardPageComponent } from './dashboard.component'

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ModalModule,
    RouterModule 
  ],
  providers: [
    DashboardPageComponent,
  ]
})
export class DashboardModule { }
