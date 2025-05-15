import {ElementRef} from "@angular/core";

export function openLink(link: string, openInNewTab: boolean = false, document: Document, elementRef: ElementRef) {
  const anchorElement = document.createElement('a');
  anchorElement.setAttribute('href', link);
  if(openInNewTab) {
    anchorElement.setAttribute('target', '_blank');
  }
  anchorElement.style.display = 'none';
  elementRef.nativeElement.appendChild(anchorElement);
  anchorElement.click();
  elementRef.nativeElement.removeChild(anchorElement);
}
