import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AppSvgIconComponent } from '../app-svg-icon/app-svg-icon.component';
import { NgClass } from '@angular/common';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [NgClass, SpinnerComponent, AppSvgIconComponent],
    }),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    appearance: {
      control: 'select',
      options: ['textType', 'primary', 'outline', 'primaryRounded', 'outlineRounded'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    iconSize: { control: 'number' },
    iconSrc: { control: 'text' },
    iconColor: { control: 'text' },
    buttonColor: { control: 'text' },
    outlineColor: { control: 'text' },
    textButtonColor: { control: 'text' },
  },
} as Meta<ButtonComponent>;

const Template: StoryFn<ButtonComponent> = (args) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  type: 'button',
  appearance: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  loading: false,
  buttonColor: 'bg-primary-500',
  outlineColor: 'border-primary-500',
  textButtonColor: 'text-primary-500',
};

export const Outline = Template.bind({});
Outline.args = {
  ...Primary.args,
  appearance: 'outline',
};

export const PrimaryRounded = Template.bind({});
PrimaryRounded.args = {
  ...Primary.args,
  appearance: 'primaryRounded',
};

export const OutlineRounded = Template.bind({});
OutlineRounded.args = {
  ...Primary.args,
  appearance: 'outlineRounded',
};

export const TextType = Template.bind({});
TextType.args = {
  ...Primary.args,
  appearance: 'textType',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Primary.args,
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Primary.args,
  loading: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...Primary.args,
  iconSrc: 'assets/icon.svg',
  iconSize: 24,
};
