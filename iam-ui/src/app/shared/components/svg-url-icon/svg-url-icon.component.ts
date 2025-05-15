import {Component, input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-svg-url-icon',
  standalone: true,
  imports: [],
  templateUrl: './svg-url-icon.component.html',
  styleUrl: './svg-url-icon.component.scss'
})
export class SvgUrlIconComponent implements OnInit {
  svgIcon: SafeHtml | null = null;

  svgUrl = input.required<string>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.http.get(this.svgUrl(), { responseType: 'text' }).subscribe(
      (svgContent) => {
        this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(svgContent);
      },
      (error) => {
        console.error('Failed to load SVG:', error);
      }
    );
  }
}
