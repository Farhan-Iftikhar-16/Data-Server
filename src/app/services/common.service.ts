import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  selectedFile = new Subject();
  getListOfFoldersAndFiles = new Subject();
  sendFoldersOrFiles = new Subject();

  constructor() { }
}
