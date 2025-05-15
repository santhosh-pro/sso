import {Component, inject} from '@angular/core';
import {NGL_CONFIG} from '../../ngl-config.token';

@Component({
  selector: 'app-env-banner',
  standalone: true,
  imports: [],
  templateUrl: './env-banner.component.html',
  styleUrl: './env-banner.component.scss'
})
export class EnvBannerComponent {
  config = inject(NGL_CONFIG);
}
