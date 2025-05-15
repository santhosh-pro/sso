import {AfterContentInit, Component, EventEmitter, inject, input, Output, signal} from '@angular/core';
import {AppSvgIconComponent} from "../../components/app-svg-icon/app-svg-icon.component";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";


import {FormControl, NgControl} from "@angular/forms";
import {HumanizeFormMessagesPipe} from "../humanize-form-messages.pipe";
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";

@Component({
  selector: 'app-single-item-picker-input',
  standalone: true,
  imports: [
    AppSvgIconComponent,
    ClickOutsideDirective,
    HumanizeFormMessagesPipe
  ],
  templateUrl: './single-item-picker-input.component.html',
  styleUrl: './single-item-picker-input.component.scss'
})
export class SingleItemPickerInputComponent<T> extends BaseControlValueAccessor implements AfterContentInit {
  title = input.required<string>();
  items = input<T[]>([]);
  display = input.required<string>();
  value = input<string>();

  errorMessages = signal<{ [key: string]: string }>({});
  ngControl = inject(NgControl, {optional: true, self: true});

  isPopUpOpen = signal(false);

  @Output()
  valueChanged: EventEmitter<T | null> = new EventEmitter<T | null>();

  constructor() {
    super();
    if(this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  override onWriteValue(value: any): void {

  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if(formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }
  }

  getProperty(item: T): any {
    if(this.display() == null || this.display() == '') {
      return item;
    }
    let object = item as any;
    return this.display().split('.').reduce((acc, part) => acc && acc[part], object);
  }

  getPropertyId(item: T): any {
    if (!this.value()) {
      return item;
    }
    let object = item as any;
    return this.value()!.split('.').reduce((acc, part) => acc && acc[part], object);
  }

  onItemClicked(item: T) {
    this.isPopUpOpen.update(p => false);
    this.markAsTouched();
    const value = this.getPropertyId(item);
    if (value == this.formControl.value) {
      this.onChange(value);
      this.valueChanged.emit(null);
    } else {
      this.onChange(value);
      this.valueChanged.emit(item);
    }
  }

  outsideClicked() {
    this.isPopUpOpen.update(p => false);
  }

  togglePopup() {
    this.isPopUpOpen.update(p => !p);
  }
}
