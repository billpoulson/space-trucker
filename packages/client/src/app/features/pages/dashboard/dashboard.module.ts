import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UIModule } from '../../../core/modules/ui.module';
import { ChatPanelModule } from '../../components/chat-panel/chat-panel.module';
import { DashboardPageComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ChatPanelModule,
  ],
  providers: [
    DashboardPageComponent,
  ]
})
export class DashboardModule { }
