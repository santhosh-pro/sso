import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal
} from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HumanizeFormMessagesPipe } from '../humanize-form-messages.pipe';
import { AppSvgIconComponent } from '../../components/app-svg-icon/app-svg-icon.component';
import { BaseControlValueAccessor } from '../../base/base-control-value-accessor';
import { BaseInputComponent } from '../_base/base-input/base-input.component';
import { NgxMaskDirective } from 'ngx-mask';
import { debounceTime, Subject } from 'rxjs';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    HumanizeFormMessagesPipe,
    AppSvgIconComponent,
    CommonModule,
    BaseInputComponent,
    NgxMaskDirective
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent extends BaseControlValueAccessor implements AfterContentInit, AfterViewInit, OnDestroy {
  appearance = input<'fill' | 'outline'>('outline');
  type = input<'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'time'>('text');
  viewType = input<'text' | 'text-area'>('text');
  iconSrc = input<string | null>();
  actionIcon = input<string | null>();
  label = input<string | null>();
  fullWidth = input<boolean>(false);
  placeholder = input<string>('');
  errorMessages = input<{ [key: string]: string }>({});
  showErrorSpace = input<boolean>(false);
  mask = input<string | null>(null);
  debounceSearchEnabled = input<boolean>(true);
  isPrefixSelect = input<boolean>(false);
  prefixOptions = input<SelectOption[]>([]);
  defaultPrefixValue = input<string | null>(null);

  changeValue = output<string>();
  actionIconClicked = output();
  prefixChanged = output<string>();

  isFocused = signal(false);
  prefixControl = new FormControl('');

  ngControl = inject(NgControl, { optional: true, self: true });

  private searchSubject: Subject<string> = new Subject<string>();

  constructor() {
    super();
    if (this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  protected onWriteValue(value: any): void {
    if (this.formControl) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if (formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }

    // Initialize prefixControl with default value
    if (this.isPrefixSelect()) {
      const defaultValue = this.defaultPrefixValue() ?? this.prefixOptions()[0]?.value ?? '';
      if (defaultValue) {
        this.prefixControl.setValue(defaultValue, { emitEvent: false });
        this.prefixChanged.emit(defaultValue);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.debounceSearchEnabled()) {
      this.searchSubject.pipe(debounceTime(600)).subscribe((value: string) => {
        this.changeValue.emit(value);
      });
    }
  }

  ngOnDestroy(): void {
    try {
      this.searchSubject.complete();
    } catch (e) {}
  }

  onValueChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.value);
    if (this.debounceSearchEnabled()) {
      this.searchSubject.next(target.value);
    } else {
      this.changeValue.emit(target.value);
    }
  }

  onPrefixChanged(value: string) {
    // Avoid setting value to prevent infinite loop; [formControl] already updates prefixControl
    this.prefixChanged.emit(value);
  }

  getClass() {
    let cls = '';
    if (this.fullWidth()) {
      cls += 'w-full ';
    }
    return cls;
  }

  onActionClicked() {
    this.actionIconClicked.emit();
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.onTouched();
    this.isFocused.set(false);
  }
}