import {Component, input, Input} from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [
    SvgIconComponent
  ],
  templateUrl: './app-svg-icon.component.html',
  styleUrl: './app-svg-icon.component.css'
})
export class AppSvgIconComponent {

  src = input.required<string>();
  stretch = input(false);
  size = input(24);
  svgStyle = input<{ [key: string]: any }>({});
}
