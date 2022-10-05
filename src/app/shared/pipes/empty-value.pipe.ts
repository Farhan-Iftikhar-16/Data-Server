import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue'
})
export class EmptyValuePipe implements PipeTransform {

  transform(value, optional = '-'): any {
    return value || optional;
  }

}
