import {
  AfterContentInit,
  Component, inject, input,
  output,
  signal
} from '@angular/core';
import {NgClass} from "@angular/common";
import {CheckboxComponent} from "../checkbox/checkbox.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseControlValueAccessorV2} from "../../base/base-control-value-accessor-v2";
import {BaseInputComponent} from "../_base/base-input/base-input.component";
import {HumanizeFormMessagesPipe} from "../humanize-form-messages.pipe";
import {AppSvgIconComponent} from "../../components/app-svg-icon/app-svg-icon.component";
import {NgxMaskDirective} from "ngx-mask";
import {Overlay} from "@angular/cdk/overlay";
import {CdkPortal} from "@angular/cdk/portal";

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    BaseInputComponent,
    HumanizeFormMessagesPipe,
    NgxMaskDirective,
    ReactiveFormsModule,
    CheckboxComponent,
    CdkPortal,
    AppSvgIconComponent
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent extends BaseControlValueAccessorV2<TimePickerValue> implements AfterContentInit {

  overlay = inject(Overlay);

  iconSrc = input<string | null>();
  fullWidth = input<boolean>(false);
  showErrorSpace = input<boolean>(false);
  showTimePickerIcon = input<boolean>(true);

  valueChanged = output<TimePickerValueEvent>();

  scrollStrategy = this.overlay.scrollStrategies.block();


  isOpen = signal(false);
  errorMessages = signal<{ [key: string]: string }>({});
  enableApplyActions = signal<boolean>(false);
  hours = signal<number>(12);
  minutes = signal<number>(0);
  period = signal<'AM' | 'PM' | null>('AM');
  is24HourFormat = signal<boolean>(false);
  isFocused = signal(false);

  handleHourUpdate = false;
  previousValidHours: number = 12;
  previousValidMinutes: number = 0;

  protected override onValueReady(value: TimePickerValue): void {
    if (value) {
      let hours = value.hours;
      let minutes = value.minutes;

      if (hours < 0 || hours > 23) {
        hours = 12;
      }

      if (minutes < 0 || minutes > 59) {
        minutes = 0;
      }

      this.hours.set(hours);
      this.minutes.set(minutes);
      this.is24HourFormat.set(false);
      this.period.set('AM');
    }
  }

  ngAfterContentInit(): void {
    super.initFormControl();
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.onTouched();
    this.isFocused.set(false);
  }

  getClass() {
    let cls = '';
    if (this.iconSrc()) {
      cls = cls + 'pr-3 pl-10';
    } else {
      cls = cls + 'px-3';
    }

    if (this.fullWidth()) {
      cls = cls + ' ' + 'w-full';
    }

    return cls;
  }


  onHourUpClicked() {
    if (this.is24HourFormat()) {
      this.hours.update(prev => (prev === 23 ? 0 : prev + 1));
    } else {
      this.hours.update(prev => (prev === 12 ? 1 : prev + 1));
    }
    this.valueUpdated();
  }

  onHourDownClicked() {
    if (this.is24HourFormat()) {
      this.hours.update(prev => (prev === 0 ? 23 : prev - 1));
    } else {
      this.hours.update(prev => (prev === 1 ? 12 : prev - 1));
    }
    this.valueUpdated();
  }

  onMinuteUpClicked() {
    if (this.minutes() === 59) {
      this.minutes.set(0);
      if (this.handleHourUpdate) {
        this.onHourUpClicked();
      }
    } else {
      this.minutes.update(prev => prev + 1);
    }
    this.valueUpdated();
  }

  onMinuteDownClicked() {
    if (this.minutes() === 0) {
      this.minutes.set(59);
      if (this.handleHourUpdate) {
        this.onHourDownClicked();
      }
    } else {
      this.minutes.update(prev => prev - 1);
    }
    this.valueUpdated();
  }

  togglePeriod() {
    if (!this.is24HourFormat()) {
      this.period.update(prev => (prev === 'AM' ? 'PM' : 'AM'));
    }
  }

  toggle24HourFormat(isChecked: boolean) {
    this.is24HourFormat.set(isChecked);
    if (this.is24HourFormat()) {
      if (this.period() === 'PM' && this.hours() !== 12) {
        this.hours.set(this.hours() + 12);
      } else if (this.period() === 'AM' && this.hours() === 12) {
        this.hours.set(0);
      }
      this.period.set(null);
    } else {
      if (this.hours() >= 12) {
        this.period.set('PM');
        this.hours.set(this.hours() === 12 ? 12 : this.hours() - 12);
      } else {
        this.period.set('AM');
        this.hours.set(this.hours() === 0 ? 12 : this.hours());
      }
    }
    this.previousValidHours = this.hours();
    this.previousValidMinutes = this.minutes();
  }

  validateHours($event: FocusEvent) {
    const inputElement = $event.target as HTMLInputElement;
    const inputHours = parseInt(inputElement.value, 10);

    if (this.is24HourFormat()) {
      if (inputHours >= 0 && inputHours <= 23) {
        this.hours.set(inputHours);
        this.previousValidHours = inputHours;
        this.valueUpdated();
      } else {
        this.hours.set(this.previousValidHours);
      }
    } else {
      if (inputHours >= 1 && inputHours <= 12) {
        this.hours.set(inputHours);
        this.previousValidHours = inputHours;
        this.valueUpdated();
      } else {
        this.hours.set(this.previousValidHours);
      }
    }
    inputElement.value = this.getFormattedHours();
  }

  validateMinutes($event: FocusEvent) {
    const inputElement = $event.target as HTMLInputElement;
    const inputMinutes = parseInt(inputElement.value, 10);
    if (inputMinutes >= 0 && inputMinutes <= 59) {
      this.minutes.set(inputMinutes);
      this.previousValidMinutes = inputMinutes;
      this.valueUpdated();
    } else {
      this.minutes.set(this.previousValidMinutes);
    }
    inputElement.value = this.getFormattedMinutes();
  }

  getFormattedHours(): string {
    return this.hours() < 10 ? `0${this.hours()}` : `${this.hours()}`;
  }

  getFormattedMinutes(): string {
    return this.minutes() < 10 ? `0${this.minutes()}` : `${this.minutes()}`;
  }

  valueUpdated() {
    let value = {
      hours12F: this.hours(),
      minutes12F: this.minutes(),
      hours24F: this.is24HourFormat() ? this.hours() : this.period() === 'PM' ? this.hours() + 12 : this.hours(),
      minutes24F: this.minutes(),
      period: this.is24HourFormat() ? null : this.period()
    };
    this.onChange(value);
    this.valueChanged.emit(value);
  }

  onTimePickerIconClick() {
    this.isOpen.update(prev => !prev);
  }

  onClickOutside() {
    this.isOpen.set(false);
  }
}

export interface TimePickerValue {
  hours: number;
  minutes: number;
}

export interface TimePickerValueEvent {
  hours12F: number;
  minutes12F: number;
  hours24F: number;
  minutes24F: number;
  period: 'AM' | 'PM' | null;
}
