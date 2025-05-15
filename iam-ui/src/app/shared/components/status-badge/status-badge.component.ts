import {Component, input, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-status-badge',
  imports: [
    NgClass
  ],
  templateUrl: './status-badge.component.html',
  standalone: true,
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  status = input.required<string | null | undefined>();
  backgroundColorClass = input.required<string | null>();
  indicatorColor = input<string | null>();
  textColorClass = input.required<string | null>();
  borderColorClass = input.required<string | null>();
  isUpperCase = input<boolean>(false);
}
