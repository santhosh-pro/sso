import {Component, input} from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {HumanizeFormMessagesPipe} from '../humanize-form-messages.pipe';

@Component({
  selector: 'app-error',
  imports: [
    HumanizeFormMessagesPipe
  ],
  templateUrl: './app-error.component.html',
  styleUrl: './app-error.component.scss'
})
export class AppErrorComponent {

  control = input.required<AbstractControl<any, any> | null>();
  errorMessages = input<{ [key: string]: string }>({});

  get hasErrors() {
    return (this.control() && this.control()?.touched && this.control()?.errors) ?? false;
  }
}
