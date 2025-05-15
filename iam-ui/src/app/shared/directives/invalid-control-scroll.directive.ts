import {Directive, ElementRef, HostListener, inject} from '@angular/core';
import {FormGroupDirective} from "@angular/forms";
import {debounceTime, fromEvent, take} from "rxjs";

@Directive({
  selector: '[appInvalidControlScroll]',
  standalone: true
})
export class InvalidControlScrollDirective {

  elementRef = inject(ElementRef);
  formGroupDirective = inject(FormGroupDirective);

  constructor() {
  }

  @HostListener("ngSubmit") onSubmit() {
    this.formGroupDirective.control.markAllAsTouched();
    if (this.formGroupDirective.control.invalid) {
      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector(
      ".ng-invalid"
    );

    const scrollOffset = this.getTopOffset(firstInvalidControl);
    if (scrollOffset) {
      window.scroll({
        top: scrollOffset,
        left: 0,
        behavior: "smooth"
      });

      fromEvent(window, "scroll")
        .pipe(
          debounceTime(100),
          take(1)
        )
        .subscribe(() => firstInvalidControl.focus());
    }
  }

  private getTopOffset(controlEl: HTMLElement): number | null {
    try {
      const labelOffset = 50;
      return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    } catch (e) {
      return null;
    }
  }

}
