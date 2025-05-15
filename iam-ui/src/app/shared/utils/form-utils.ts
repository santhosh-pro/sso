import { FormGroup } from '@angular/forms';

export function printInvalidFields(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);

    if (control && control.invalid) {
      console.log(`Field: ${field}`);

      const errors = control.errors;
      if (errors) {
        Object.keys(errors).forEach(errorKey => {
          console.log(` - Validation Error: ${errorKey}, Value: ${errors[errorKey]}`);
        });
      }
    }

    // Check for nested FormGroup
    if (control instanceof FormGroup) {
      printInvalidFields(control);
    }
  });
}
