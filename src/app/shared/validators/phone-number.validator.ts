import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;
    const validPhoneRegex = /^5\d{8}$/;
    const numericOnlyRegex = /^\d+$/;

    if (phoneNumber && !numericOnlyRegex.test(phoneNumber)) {
      return { nonNumericText: true };
    }

    if (phoneNumber && !validPhoneRegex.test(phoneNumber)) {
      return { phoneNumberInvalid: true };
    }

    return null;
  };
}
