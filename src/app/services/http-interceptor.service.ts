import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor() {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpHeader = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: localStorage.getItem('token') ? 'Bearer ' + JSON.parse(localStorage.getItem('token')) : ''
    });


    const clonedHttpRequest = req.clone({headers: httpHeader});

    return next.handle(clonedHttpRequest);
  }
}
