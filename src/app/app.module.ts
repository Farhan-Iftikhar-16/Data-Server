import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NavbarComponent} from "./shared/components/navbar/navbar.component";
import {SidebarComponent} from "./shared/components/sidebar/sidebar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MessageService, TreeDragDropService} from "primeng/api";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {HttpInterceptorService} from "./services/http-interceptor.service";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule
    ],
  providers: [
    TreeDragDropService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
