import {Directive, ElementRef, HostListener, inject} from '@angular/core';
import {FormGroupDirective} from "@angular/forms";
import {debounceTime, fromEvent, take} from "rxjs";

@Directive({
  selector: '[appInvalidControlScrollContainer]',
  standalone: true
})
export class InvalidControlScrollContainerDirective {


  elementRef = inject(ElementRef);
  formGroupDirective = inject(FormGroupDirective);
  scrollContainerDir = inject(InvalidControlScrollContainerDirective, {optional: true});

  private get containerEl(): HTMLElement | any {
    return this.scrollContainerDir
      ? this.scrollContainerDir.containerEl
      : window;
  }

  constructor() { }

  @HostListener("ngSubmit") onSubmit() {
    if (this.formGroupDirective.control.invalid) {
      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector(
      ".ng-invalid"
    );

    this.containerEl.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth"
    });

    fromEvent(this.containerEl, "scroll")
      .pipe(
        debounceTime(100),
        take(1)
      )
      .subscribe(() => firstInvalidControl.focus());
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    const controlElTop = controlEl.getBoundingClientRect().top;

    if (this.scrollContainerDir) {
      const containerTop = this.containerEl.getBoundingClientRect().top;
      const absoluteControlElTop = controlElTop + this.containerEl.scrollTop;

      return absoluteControlElTop - containerTop - labelOffset;
    } else {
      const absoluteControlElTop = controlElTop + window.scrollY;

      return absoluteControlElTop - labelOffset;
    }
  }

}
