import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthroizedWebSocketService } from '../../../core/services/sockets/authorized-web-socket.service';

@Component({
  standalone: false,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public authService: AuthService,
    public asd: AuthroizedWebSocketService,
  ) {

  }
  ngOnInit(): void {
  }

  tryLogin() {
    this.authService.loginWithRedirect({
      appState: { target: 'dashboard' }
    });
  }
  logout() {
    this.authService.logout({
      logoutParams: {
        returnTo: this.document.location.origin + '/logout'
      }
    });
  }

}
