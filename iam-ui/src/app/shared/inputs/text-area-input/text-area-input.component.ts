import {AfterContentInit, Component, inject, input, output} from '@angular/core';
import {FormControl, NgControl, ReactiveFormsModule} from "@angular/forms";
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";
import {HumanizeFormMessagesPipe} from "../humanize-form-messages.pipe";
import {BaseInputComponent} from "../_base/base-input/base-input.component";

@Component({
  selector: 'app-text-area-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HumanizeFormMessagesPipe,
    BaseInputComponent
  ],
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss'
})
export class TextAreaInputComponent extends BaseControlValueAccessor implements AfterContentInit {
  appearance = input<'fill' | 'outline'>('outline');
  type = input<'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'>('text');
  viewType = input<'text' | 'text-area'>('text');
  label = input.required<string>();
  fullWidth = input<boolean>(true);
  placeholder = input<string>('');
  rows = input<number>(4)
  errorMessages = input<{ [key: string]: string }>({});
  showErrorSpace = input<boolean>(false);

  changeValue = output<any>();

  ngControl = inject(NgControl, {optional: true, self: true});

  constructor() {
    super();
    if(this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if(formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }
  }

  onValueChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.value);
    this.changeValue.emit(target.value);
  }

  protected onWriteValue(obj: any): void {
  }
}
