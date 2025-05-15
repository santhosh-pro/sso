import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {NGL_CONFIG} from '../../ngl-config.token';

@Component({
  selector: 'app-responsive-helper',
  standalone: true,
  imports: [],
  templateUrl: './responsive-helper.component.html',
  styleUrl: './responsive-helper.component.scss'
})
export class ResponsiveHelperComponent implements OnInit {

  config = inject(NGL_CONFIG);

  document = inject(DOCUMENT);
  screenWidth = signal(0);

  constructor() {
    this.screenWidth.set(this.document.documentElement.clientWidth);
  }

  ngOnInit(): void {
    this.document.addEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth.set(this.document.documentElement.clientWidth);
  }
}
