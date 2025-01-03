import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialUIModule } from '../../../core/modules/material.ui.module';
import { SharedUIComponentsModule } from "../shared.ui.module";
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ChatPanelComponent } from './chat-panel.component';
import { NotConnectedComponent } from './not-connected/not-connected.component';
import { SetUserNameDialogComponent } from './set-user-name-dialog/set-user-name-dialog.component';

const components = [
  NotConnectedComponent,
  ChatPanelComponent,
  ChatChannelComponent
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialUIModule,
    SharedUIComponentsModule,
  ],
  declarations: [
    ...components,
    SetUserNameDialogComponent,
  ],
  exports: [
    ...components
  ]
})
export class ChatPanelModule { }
