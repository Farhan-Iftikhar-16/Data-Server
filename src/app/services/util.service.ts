import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ERROR_MESSAGES } from '../config/constant';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  static redirectUrl = '';

  constructor(
    private router: Router
  ) { }

  omit(obj: object, paths: Array<string>): void {
    paths.forEach(key => delete obj[key]);
  }

  navigate(route: string, data: any = {}): void {
    this.router.navigate([route], { queryParams: data });
  }

  rgbToHex(r, g, b): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex
    }).join('');
  }

  hexToRgb(hex): string {
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16));
  }

  convertBytes(bytes, decimalPlaces = 2): string {
    if (bytes === 0)  { return '0 Bytes'; }
    const k = 1024;
    decimalPlaces = decimalPlaces < 0 ? 0 : decimalPlaces;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPlaces))} ${sizes[i]}`;
  }

  getFileExt(fileName): string {
    if (typeof fileName === 'number') { return undefined; }
    const re = /(?:\.([^.]+))?$/;
    return re.exec(fileName)[1];
  }

  static getErrorMsg(formControl: AbstractControl, customError = {}): string {
    const errors = formControl.errors;
    let error = '';
    let hasError ;
    if (errors) {
      hasError = Object
        .keys(errors)
        .some(errorKey => {
          if (errors[errorKey]) {
            error = customError[errorKey] || ERROR_MESSAGES[errorKey] || 'Invalid value';
            return true;
          }
        });
    }

    return hasError ? error : '';
  }

  validateAllFormFields(formGroup?: FormGroup): void {
    Object
      .keys(formGroup.controls)
      .forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          if (typeof control.value === 'string') {
            control.setValue(control.value.trim());
          }
          control.markAsDirty({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(ctrl => {
            if (ctrl instanceof FormControl) {
              if (typeof ctrl.value === 'string') {
                ctrl.setValue(ctrl.value.trim());
              }
              ctrl.markAsDirty({ onlySelf: true });
            } else if (ctrl instanceof FormGroup) {
              this.validateAllFormFields(ctrl);
            }
          });
        }
      });
  }

  static getMonthName(num): string {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug",
      "Sep", "Oct", "Nov", "Dec"];
    return months[num];
  }

  static getDayName(date):string {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }
}
