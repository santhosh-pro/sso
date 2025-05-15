import {
  AfterContentInit,
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {FormControl, NgControl, ReactiveFormsModule} from "@angular/forms";
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent extends BaseControlValueAccessor implements OnInit, AfterContentInit {
  title = input<string | null>();

  id = signal<string>('');

  @Output()
  valueChanged = new EventEmitter<boolean>();

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

  ngOnInit(): void {
    this.id.set(this.getId());
  }

  protected override onWriteValue(value: any): void {

  }

  onSwitchSelected($event: Event) {
    if (!this.disabled()) {
      this.markAsTouched();
      const value = ($event.target as HTMLInputElement).checked;
      this.onChange(value);
      this.valueChanged.emit(value);
    }
  }

  private getId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `checkbox-${randomNumber.toString()}`;
  }
}
