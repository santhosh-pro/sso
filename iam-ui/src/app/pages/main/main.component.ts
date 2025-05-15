import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'src/app/shared/oauth.service';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { OverlayService } from '@shared/public-api';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, BreadcrumbComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private auth = inject(OAuthService);
  private overlayService = inject(OverlayService);

  dropdownOpen = false;

  toggleDropdown() {
    this.overlayService.openNearElement(
    )
  }

  logout() {
    this.auth.logout();
  }
}
