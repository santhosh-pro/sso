import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { MultiDatePickerComponent, Weekday } from './multi-date-picker/multi-date-picker.component';

@Component({
  selector: 'app-multi-date-picker-overlay',
  standalone: true,
  imports: [MultiDatePickerComponent, FormsModule],
  templateUrl: './multi-date-picker-overlay.component.html',
  styleUrl: './multi-date-picker-overlay.component.css'
})
export class MultiDatePickerOverlayComponent {
  dialogRef = inject(DialogRef);
  data: {
    selectedDates: Date[];
    minDate: Date | null;
    maxDate: Date | null;
    allowOnlyPast: boolean;
    allowOnlyFuture: boolean;
    disabledDays: Weekday[];
    disabledDates: Date[];
  } = inject(DIALOG_DATA);

  onDateSelected(dates: Date[]) {
    this.dialogRef.close(dates);
  }
}