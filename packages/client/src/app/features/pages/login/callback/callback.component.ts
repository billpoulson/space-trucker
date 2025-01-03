import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  standalone: false,
  selector: 'app-login-page',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public authService: AuthService,
    private router: Router
  ) {
  }
  async ngAfterViewInit() {
  }
  async ngOnInit() {
  }

}
