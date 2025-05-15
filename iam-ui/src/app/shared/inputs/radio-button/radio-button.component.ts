import {AfterContentInit, Component, EventEmitter, inject, input, OnInit, Output, signal} from '@angular/core';
import {FormControl, NgControl, ReactiveFormsModule} from "@angular/forms";
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss'
})
export class RadioButtonComponent extends BaseControlValueAccessor implements OnInit, AfterContentInit {
  title = input<string | null>();
  groupName = input.required<string>();
  value = input<any | null>();

  id = signal<string>('');

  @Output()
  valueChanged = new EventEmitter<any>();

  ngControl = inject(NgControl, {optional: true, self: true});

  errorMessages = input<{ [key: string]: string }>({});

  constructor() {
    super();
    if (this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if (formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }
  }

  protected override onWriteValue(obj: any): void {

  }

  ngOnInit(): void {
    this.id.set(this.getId());
  }

  onRadioSelected($event: Event) {
    if (!this.disabled()) {
      this.markAsTouched();
      const value = ($event.target as HTMLInputElement).value;
      // this.onChange(value);
      this.valueChanged.emit(value);
    }
  }

  private getId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `radio-button-${randomNumber.toString()}`;
  }
}
