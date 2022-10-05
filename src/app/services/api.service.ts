import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiURL = environment.API_URL;
  showLoader = false;

  constructor(
    private httpClient: HttpClient
  ) { }

  login(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}accounts/login`, params);
  }

  signup(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}accounts/signup`, params);
  }

  logout(id): Observable<any> {
    return this.httpClient.get(`${this.apiURL}logout/${id}`);
  }

  addNewFolderOrFile(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}create`, params);
  }

  deleteFolderOrFile(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}delete`, params);
  }

  getListOfFoldersAndFiles(userId): Observable<any> {
    return this.httpClient.get(`${this.apiURL}list/${userId}`);
  }

  saveFileContent(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}saveFileContent`, params);
  }

  shareFoldersOrFilesWithUsers(params): Observable<any> {
    return this.httpClient.post(`${this.apiURL}shareFoldersOrFilesWithUsers`, params);
  }

  searchUsers(id, query): Observable<any> {
    return this.httpClient.get(`${this.apiURL}accounts/searchUsers/${id}/${query}`);
  }

  testing(file): Observable<any> {
    let formData = new FormData();
    formData.set('name', file);
    return this.httpClient.post(`http://localhost:4000/testing-s3`, formData);
  }
}
