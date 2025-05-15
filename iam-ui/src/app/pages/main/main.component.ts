import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'src/app/shared/oauth.service';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, BreadcrumbComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private auth = inject(OAuthService);

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.auth.logout();
  }
}
