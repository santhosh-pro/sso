import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from '@core/oauth.service';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent {
  private auth = inject(OAuthService);
  private router = inject(Router);
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
    } else {
      await this.router.navigate(['/main']);
    }
  }
}
