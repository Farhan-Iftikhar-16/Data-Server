import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value, length): string {
    if (!value) {
      return '';
    }

    return value.length > length ? `${value.substring(0, length - 3)} ...` : value;
  }

}
