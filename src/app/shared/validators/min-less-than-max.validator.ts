import { ValidatorFn, AbstractControl } from '@angular/forms';

export function minLessThanMaxValidator(minKey: string, maxKey: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const minControl = formGroup.get(minKey);
    const maxControl = formGroup.get(maxKey);

    if (!minControl || !maxControl) {
      return null;
    }

    const minValue = minControl.value;
    const maxValue = maxControl.value;

    const errors: any = {};

    const isMinValid = /^-?\d+(\.\d+)?$/.test(minValue);
    const isMaxValid = /^-?\d+(\.\d+)?$/.test(maxValue);

    if (!isMinValid && minValue) {
      errors.minNotANumber = true;
    }
    if (!isMaxValid && maxValue) {
      errors.maxNotANumber = true;
    }

    if ((minValue && !maxValue) || (!minValue && maxValue)) {
      errors.bothFieldsRequired = true;
    }

    const parsedMinValue = isMinValid ? parseFloat(minValue) : NaN;
    const parsedMaxValue = isMaxValid ? parseFloat(maxValue) : NaN;

    if (!isNaN(parsedMinValue) && !isNaN(parsedMaxValue) && parsedMinValue > parsedMaxValue) {
      errors.minGreaterThanMax = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
