import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { AuthService } from '@auth0/auth0-angular'
import { Observable } from 'rxjs'
import { defaultTheme, THEME_TOKEN } from './config/theme.config'
import { UIModule } from './core/modules/ui.module'
import { UX } from './features/components/shared/app-loading-spinner/UX'
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
  isLoading$: Observable<boolean>
  fullUrl!: string
  constructor(
    public authService: AuthService,
    private ux: UX,
  ) {
    this.isLoading$ = ux.useLoadingStatus$()
  }

  async ngOnInit() {
    await this.ux.withLogin$()

    
  }

  title = 'space-trucker';
}
