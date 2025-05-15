import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MultiDatePickerComponent, Weekday } from '@shared/inputs/multi-date-picker/multi-date-picker.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-date-picker-overlay',
  standalone: true,
  imports: [MultiDatePickerComponent, FormsModule],
  templateUrl: './multi-date-picker-overlay.component.html',
  styleUrl: './multi-date-picker-overlay.component.scss'
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