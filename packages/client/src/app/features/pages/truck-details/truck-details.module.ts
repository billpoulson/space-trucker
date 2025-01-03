import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UIModule } from '../../../core/modules/ui.module';
import { GoBackDirective } from '../../directives/go-back.directive';
import { TruckDashboardComponent } from './truck-details.component';

@NgModule({
  declarations: [
    TruckDashboardComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    GoBackDirective
  ],

})
export class TruckDetailsModule { }
