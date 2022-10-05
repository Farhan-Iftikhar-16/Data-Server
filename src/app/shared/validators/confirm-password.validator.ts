import { FormControl, ValidatorFn } from '@angular/forms';

export class ConfirmPasswordValidator {

  static MatchPassword(comparisonValue = ''): ValidatorFn {
    return (c: FormControl): { [key: string]: boolean } | null => {
      const fieldValue = c.value;
      if (!fieldValue || fieldValue !== comparisonValue) {
        return { notMatch: true };
      }

      return undefined;
    };
  }
}
