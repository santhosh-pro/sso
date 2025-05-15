import {AfterContentInit, Component, output} from '@angular/core';
import {
  BaseControlValueAccessorV2,
} from "../../base/base-control-value-accessor-v2";
import {ButtonComponent} from "../../components/button/button.component";
import {TimePickerValue} from "../time-picker/time-picker.component";

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent extends BaseControlValueAccessorV2<TimePickerValue> implements AfterContentInit {
  valueChanged = output<number>();

  ngAfterContentInit(): void {
    super.initFormControl();
  }

  protected override onValueReady(value: TimePickerValue): void {
    // this.formValue.set(value);
  }

  increment() {
    // let newValue = (this.value() ?? 0) + 1;
    // this.updateValue(newValue);
    // this.valueChanged.emit(newValue);
  }

  private text(someType: Object) {

  }
}
