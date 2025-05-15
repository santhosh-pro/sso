import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';
import { NgClass } from '@angular/common';

export default {
  title: 'Components/DatePicker',
  component: DatePickerComponent,
  parameters: {
    controls: { expanded: true },
  },

  tags: ['autodocs'],
  argTypes: {
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    allowOnlyPast: { control: 'boolean' },
    allowOnlyFuture: { control: 'boolean' },
    allowToday: { control: 'boolean' },
    disabledDays: { control: 'array' },
    disabledDates: { control: 'array' },
  },
};

const Template: StoryFn<DatePickerComponent> = (args) => ({
  props: args,
  template: `
    <app-date-picker
      [minDate]="minDate"
      [maxDate]="maxDate"
      [allowOnlyPast]="allowOnlyPast"
      [allowOnlyFuture]="allowOnlyFuture"
      [allowToday]="allowToday"
      [disabledDays]="disabledDays"
      [disabledDates]="disabledDates"
      (dateSelected)="dateSelected($event)"
    ></app-date-picker>
  `,
});

export const Default = Template.bind({});
Default.args = {
  minDate: new Date(2020, 0, 1),
  maxDate: new Date(2030, 11, 31),
  allowOnlyPast: false,
  allowOnlyFuture: false,
  allowToday: true,
  disabledDays: ['sunday', 'saturday'],
  disabledDates: [new Date(2025, 4, 15), new Date(2026, 6, 20)],
};
