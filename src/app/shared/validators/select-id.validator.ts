import { AbstractControl, ValidationErrors } from '@angular/forms';

export function selectIdValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return value > 0 ? null : { invalidAgentId: true };
}
