import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core'
import { map, Observable } from 'rxjs'
import { ChatServiceState, ClientChatService } from '../../../core/services/sockets/client-chat.service'
import { SocketConnectionStatus } from '../../../core/subjects/socket-connection-status'
import { createComponentBem } from '../../../core/util/bem'

const asd = <TModel, TVal>(source: Observable<TModel>) => ({
  select: (ƒ: (τ: TModel) => TVal): Observable<TVal> => source.pipe(map(ƒ))
})

const componentSelector = 'app-chat-panel'
@Component({
  selector: componentSelector,
  templateUrl: `chat-panel.component.html`,
  styleUrls: ['./chat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ChatPanelComponent {
  bem = createComponentBem(componentSelector)
  cs$: Observable<ChatServiceState>;
  channels$: Observable<string[]>;

  constructor(
    public chatService: ClientChatService,
    public socketConnectionStatus: SocketConnectionStatus,
    cdr: ChangeDetectorRef,
  ) {
    this.cs$ = this.chatService.state$
    this.channels$ = this.chatService.state$.pipe(map(x => x.channels))
  }
}




