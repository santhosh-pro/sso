import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { ToasterComponent } from "./shared/components/toast/components/toaster/toaster.component";
import { OAuthService } from '@core/oauth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'iam-ui';

  private auth = inject(OAuthService);
  
  logout() {
    this.auth.logout();
  }
}
