import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private _router: Router,
        private _injector: Injector,
        private _auth: AuthService) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url: string = state.url;
        return this.fnCheckAuthenticate(next, url);
    }

    private fnCheckAuthenticate(next, url: string): Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            // Check if token is available or not for accessing account routing otherwise redirect to login page.
            if (!this._auth.fnGetToken()) {
                this._router.navigate(['login']);
                reject(false);
            } else {
                resolve(true);
            }
        });
    }
}

