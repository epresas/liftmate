import { FormControl } from '@angular/forms';
import { noNumbersValidator } from './form.utils';

describe('Form utils > noNumbersValidator', () => {
  it('should return error if value contains numbers', () => {
    const control = new FormControl('Exercise 1');
    const result = noNumbersValidator(control);
    expect(result).toEqual({ noNumbers: true });
  });

  it('should return null if value does not contain numbers', () => {
    const control = new FormControl('Push Ups');
    const result = noNumbersValidator(control);
    expect(result).toBeNull();
  });

  it('should return null if value is empty', () => {
    const control = new FormControl('');
    const result = noNumbersValidator(control);
    expect(result).toBeNull();
  });

  it('should return error if value is only numbers', () => {
    const control = new FormControl('123');
    const result = noNumbersValidator(control);
    expect(result).toEqual({ noNumbers: true });
  });
});