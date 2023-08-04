import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AuthModel, AuthTokenModel } from '../../core/models/auth-model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _http: HttpClient) {
  }

  fnSignIn(payload: AuthModel) {
    return this._http.post<AuthTokenModel>(environment.API_URL + `auth/login`, payload);
  }

  fnSignUp(payload: AuthModel) {
    return this._http.post<AuthTokenModel>(environment.API_URL + `auth/signup`, payload);
  }

  fnCreatePassword(payload: any): any {
    return this._http.post(environment.API_URL, payload);
  }
}
