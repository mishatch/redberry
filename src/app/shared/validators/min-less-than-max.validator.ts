import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

export function minLessThanMaxValidator(minKey: string, maxKey: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const minControl = formGroup.get(minKey);
    const maxControl = formGroup.get(maxKey);

    if (!minControl || !maxControl) {
      return null;
    }

    // Convert values to numbers
    const minValue = parseFloat(minControl.value);
    const maxValue = parseFloat(maxControl.value);

    const errors: any = {};

    // Check if only one field is filled
    if ((minControl.value && !maxControl.value) || (!minControl.value && maxControl.value)) {
      errors.bothFieldsRequired = true;
    }

    // Check if min is greater than max
    if (minValue && maxValue && minValue > maxValue) {
      errors.minGreaterThanMax = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
