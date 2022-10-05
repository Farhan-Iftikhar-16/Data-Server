import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthWrapperComponent} from './auth-wrapper/auth-wrapper.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SharedModule} from "../shared/shared.module";
import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
  declarations: [
    AuthWrapperComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule {
}
