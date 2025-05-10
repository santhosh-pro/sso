import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from './oauth.service';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private auth = inject(OAuthService);
  token: string | null = null;

  async ngOnInit() {
    const hasCode = window.location.search.includes('code=');
    if (hasCode) {
      await this.auth.processOAuthCallback();
    }

    this.token = this.auth.getAccessToken();
    console.log(this.token);
    if (!this.token && !hasCode) {
      this.auth.initOAuthFlow();
    }
  }
  logout() {
    this.auth.logout();
  }
}
