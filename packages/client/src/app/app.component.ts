import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { AuthService } from '@auth0/auth0-angular'
import { catchError, firstValueFrom, timeout } from 'rxjs'
import { defaultTheme, THEME_TOKEN } from './config/theme.config'
import { UIModule } from './core/modules/ui.module'
import { AuthroizedWebSocketService } from './core/services/sockets/authorized-web-socket.service'
import { WebsocketService } from './core/services/sockets/web-socket.service'
import { PagesModule } from './features/pages/pages.module'

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    UIModule,
    PagesModule,
  ],
  providers: [
    { provide: THEME_TOKEN, useValue: defaultTheme },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // isAuthenticated$: Observable<boolean>;
  constructor(
    private http: HttpClient,
    websocketService: WebsocketService,
    public authService: AuthService,
    public socket: AuthroizedWebSocketService
  ) {
    this.socket.messages.subscribe(m => {
      if (m.serverTime) {
        console.log(new Date(m.serverTime))
      }
    })
  }


  async ngOnInit() {
    await firstValueFrom(this.authService.isAuthenticated$.pipe(
      timeout(3000),
      catchError((err, caught) => this.authService.loginWithRedirect()),
    ))
  }

  title = 'space-trucker';
}
