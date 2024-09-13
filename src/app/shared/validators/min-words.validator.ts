import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minWordsValidator(minWords: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const wordCount = value.trim().split(/\s+/).length;

    return wordCount >= minWords ? null : { minWords: { requiredWords: minWords, actualWords: wordCount } };
  };
}
