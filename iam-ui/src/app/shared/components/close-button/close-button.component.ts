import { Component } from '@angular/core';
import {AppSvgIconComponent} from "../app-svg-icon/app-svg-icon.component";

@Component({
  selector: 'app-close-button',
  standalone: true,
    imports: [
        AppSvgIconComponent
    ],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss'
})
export class CloseButtonComponent {

}
