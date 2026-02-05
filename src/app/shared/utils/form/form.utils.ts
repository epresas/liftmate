import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const regex = /\d/;
  if (regex.test(control.value)) {
    return { noNumbers: true };
  }
  return null;
}