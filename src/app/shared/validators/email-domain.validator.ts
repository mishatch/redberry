import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailDomainValidator(domain: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const domainName = email.substring(email.lastIndexOf('@') + 1);
      if (domainName !== domain) {
        return { invalidEmailDomain: true };
      }
    }
    return null;
  };
}
