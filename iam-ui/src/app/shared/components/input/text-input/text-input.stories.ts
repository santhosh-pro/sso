import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input.component';
import { HumanizeFormMessagesPipe } from '../../../core/humanize-form-messages.pipe';
import { AppSvgIconComponent } from '../../app-svg-icon/app-svg-icon.component';
import { BaseInputComponent } from '../../../core/base-input/base-input.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/TextInput',
  component: TextInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        HumanizeFormMessagesPipe,
        AppSvgIconComponent,
        BaseInputComponent,
      ],
      providers: [provideNgxMask()],
    }),
  ],
  argTypes: {
    appearance: { control: 'select', options: ['fill', 'outline'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'time'] },
    viewType: { control: 'select', options: ['text', 'text-area'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    fullWidth: { control: 'boolean' },
    showErrorSpace: { control: 'boolean' },
    debounceSearchEnabled: { control: 'boolean' },
    iconSrc: { control: 'text' },
    actionIcon: { control: 'text' },
    mask: { control: 'text' },
    isPrefixSelect: { control: 'boolean' },
    prefixOptions: { control: 'object' },
    defaultPrefixValue: { control: 'text' },
    changeValue: { action: 'changeValue' },
    actionIconClicked: { action: 'actionIconClicked' },
    prefixChanged: { action: 'prefixChanged' },
  },
} as Meta<TextInputComponent>;

type Story = StoryObj<TextInputComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl('john.doe'),
      onChangeValue: action('changeValue'),
    },
    template: `
      <app-text-input
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [appearance]="appearance"
        [fullWidth]="fullWidth"
        [showErrorSpace]="showErrorSpace"
        [debounceSearchEnabled]="debounceSearchEnabled"
        [formControl]="formControl"
        (changeValue)="onChangeValue($event)"
      ></app-text-input>
      <div class="mt-2">Current Value: {{ formControl.value }}</div>
    `,
  }),
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    appearance: 'outline',
    fullWidth: false,
    showErrorSpace: true,
  },
};

export const WithActionIcon: Story = {
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl('search query'),
      onChangeValue: action('changeValue'),
      onActionIconClicked: action('actionIconClicked'),
    },
    template: `
      <app-text-input
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [actionIcon]="actionIcon"
        [appearance]="appearance"
        [fullWidth]="fullWidth"
        [showErrorSpace]="showErrorSpace"
        [debounceSearchEnabled]="debounceSearchEnabled"
        [formControl]="formControl"
        (changeValue)="onChangeValue($event)"
        (actionIconClicked)="onActionIconClicked()"
      ></app-text-input>
      <div class="mt-2">Current Value: {{ formControl.value }}</div>
    `,
  }),
  args: {
    label: 'Search',
    placeholder: 'Search...',
    type: 'search',
    actionIcon: 'assets/icons/search.svg',
    appearance: 'outline',
    fullWidth: true,
    showErrorSpace: true,
    debounceSearchEnabled: true
  },
};

export const WithPrefixSelect: Story = {
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl('1234567890'),
      onChangeValue: action('changeValue'),
      onPrefixChanged: action('prefixChanged'),
    },
    template: `
      <app-text-input
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [isPrefixSelect]="isPrefixSelect"
        [prefixOptions]="prefixOptions"
        [defaultPrefixValue]="defaultPrefixValue"
        [mask]="mask"
        [appearance]="appearance"
        [fullWidth]="fullWidth"
        [debounceSearchEnabled]="debounceSearchEnabled"
        [showErrorSpace]="showErrorSpace"
        [formControl]="formControl"
        (changeValue)="onChangeValue($event)"
        (prefixChanged)="onPrefixChanged($event)"
      ></app-text-input>
      <div class="mt-2">Current Value: {{ formControl.value }}</div>
    `,
  }),
  args: {
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    type: 'tel',
    isPrefixSelect: true,
    prefixOptions: [
      { value: '+1', label: 'US (+1)' },
      { value: '+44', label: 'UK (+44)' },
      { value: '+91', label: 'India (+91)' },
    ],
    defaultPrefixValue: '+1',
    mask: '(000) 000-0000',
    appearance: 'outline',
    fullWidth: true,
    showErrorSpace: true,
  },
};

export const WithPrefixSelectNoMask: Story = {
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl('1234567890'),
      onChangeValue: action('changeValue'),
      onPrefixChanged: action('prefixChanged'),
    },
    template: `
      <app-text-input
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [isPrefixSelect]="isPrefixSelect"
        [prefixOptions]="prefixOptions"
        [defaultPrefixValue]="defaultPrefixValue"
        [debounceSearchEnabled]="debounceSearchEnabled"
        [appearance]="appearance"
        [fullWidth]="fullWidth"
        [showErrorSpace]="showErrorSpace"
        [formControl]="formControl"
        (changeValue)="onChangeValue($event)"
        (prefixChanged)="onPrefixChanged($event)"
      ></app-text-input>
      <div class="mt-2">Current Value: {{ formControl.value }}</div>
    `,
  }),
  args: {
    label: 'Phone Number (No Mask)',
    placeholder: 'Enter your phone number',
    type: 'tel',
    isPrefixSelect: true,
    prefixOptions: [
      { value: '+1', label: 'US (+1)' },
      { value: '+44', label: 'UK (+44)' },
      { value: '+91', label: 'India (+91)' },
    ],
    defaultPrefixValue: '+1',
    appearance: 'outline',
    fullWidth: true,
    showErrorSpace: true,
  },
};

export const WithError: Story = {
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl('', [Validators.required]),
      onChangeValue: action('changeValue'),
    },
    template: `
      <app-text-input
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [appearance]="appearance"
        [debounceSearchEnabled]="debounceSearchEnabled"
        [fullWidth]="fullWidth"
        [showErrorSpace]="showErrorSpace"
        [formControl]="formControl"
        (changeValue)="onChangeValue($event)"
      ></app-text-input>
      <div class="mt-2">Current Value: {{ formControl.value }}</div>
    `,
  }),
  args: {
    label: 'Required Field',
    placeholder: 'Enter text',
    type: 'text',
    appearance: 'outline',
    fullWidth: true,
    showErrorSpace: true,
  },
};