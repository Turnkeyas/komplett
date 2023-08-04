import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalStorageService } from '../universal-storage-service/universal-storage.service';
import * as jwt_decode from 'jwt-decode';
import {Store} from '@ngxs/store';
import {GetAuthUserAction} from '../../../states/user';
import {LogoutAccountAction} from '../../../states/account/account.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public static COOKIE_NAME = 'komplett';

    constructor(private _router: Router,
        private _cookies: UniversalStorageService,
        private _store: Store) {
    }

    public fnGetAuthUser() {
        const token = this.fnGetToken();
        if (token) {
            const userObj: any = jwt_decode(token);
            if (userObj && userObj.id) {
              this._store.dispatch(new GetAuthUserAction(userObj.id));
            }
        }
    }

    fnGetToken(): any {
        const getCookie = this._cookies.getItem(AuthService.COOKIE_NAME);
        // HERE: Path condition  for universal because it get cookie if not available at client side.
        if (getCookie && getCookie.indexOf('path') === -1) {
            return getCookie;
        } else {
            return null;
        }

    }

    fnSetToken(authToken: string) {
        this._cookies.setItem(AuthService.COOKIE_NAME, authToken);
    }

    fnRemoveToken() {
      this._cookies.removeItem(AuthService.COOKIE_NAME);
      this._store.dispatch(new LogoutAccountAction());
    }
}
