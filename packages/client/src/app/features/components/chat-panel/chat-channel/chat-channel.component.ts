import { ChangeDetectorRef, Component, input, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ClientChatService } from '../../../../core/services/sockets/client-chat.service'
import { SocketConnectionStatus } from '../../../../core/subjects/socket-connection-status'
import { createComponentBem } from '../../../../core/util/bem'
@Component({
  selector: 'app-chat-channel',
  standalone: false,

  templateUrl: './chat-channel.component.html',
  styleUrl: './chat-channel.component.scss'
})
export class ChatChannelComponent implements OnInit {

  bem = createComponentBem('app-chat-channel')
  readonly channel = input<string>('');
  channelusers = new BehaviorSubject<Array<string>>([])
  constructor(
    public chatService: ClientChatService,
    public socketConnectionStatus: SocketConnectionStatus,
    private cdr: ChangeDetectorRef,
  ) {
  }
  ngOnInit(): void {
    // this.channel
    // this.chatService.messageReceived.subscribe(() => { cdr.markForCheck() })
    this.chatService.subscribeToChannelUsers(this.channel())
      .subscribe((users) => {
        this.channelusers.next(users)
        this.cdr.markForCheck()
      })
    // toSignal(of([]))
    // // React to changes in the signal
    // effect(() => {
    //   console.log('Signal changed:', this.inputSignal());
    // });
  }

  sendMessage(
    input: HTMLInputElement,
    channel: string,
    event: Event
  ) {
    if (input.value.trim()) {
      this.chatService.sendMessage(channel, input.value)
      input.value = ''
    }
  }
}
