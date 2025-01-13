import { Component, Input } from '@angular/core'
import { ClientChatMessageData } from '@space-truckers/types'
import { createComponentBem } from '../../../../../core/util/bem'

@Component({
  selector: 'app-chat-message',
  standalone: false,

  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  bem = createComponentBem('app-chat-channel-message')

  @Input() data!: ClientChatMessageData

  getMessageDate() {
    return new Date(this.data.timestamp).toLocaleString()
  }

  getStyles(bem: any) {
    const r = {
      ...bem,
      ['slide-in']: true,
      ['received-message']: !this.data.isSender,
      ['sent-message']: this.data.isSender,
    }
    return r
  }
}
