import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserWrapperComponent } from './user-wrapper/user-wrapper.component';
import { AddFolderOrFileComponent } from './add-folder-or-file/add-folder-or-file.component';
import {SharedModule} from "../shared/shared.module";
import {UserRoutingModule} from "./user-routing.module";

@NgModule({
  declarations: [
    UserWrapperComponent,
    AddFolderOrFileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
