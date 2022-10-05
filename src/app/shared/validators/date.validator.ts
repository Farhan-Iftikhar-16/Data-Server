import { FormControl, ValidatorFn } from '@angular/forms';

export class DateValidator {

  static MaximumDate(maxValue: Date): ValidatorFn {
    return (c: FormControl): { [key: string]: boolean } | null => {
      const fieldValue = c.value;
      if (new Date(fieldValue).getTime() > maxValue.getTime()) {
        return { maxTimeExceeded: true };
      }

      return undefined;
    };
  }

  static MinimumDate(minValue: Date): ValidatorFn {
    return (c: FormControl): { [key: string]: boolean } | null => {
      const fieldValue = c.value;
      if (new Date(fieldValue).getTime() < minValue.getTime()) {
        return { minTimeExceeded: true };
      }

      return undefined;
    };
  }
}
