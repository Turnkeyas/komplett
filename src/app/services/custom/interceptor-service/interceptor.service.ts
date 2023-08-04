import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth-service/auth.service';
import { UniversalStorageService } from '../universal-storage-service/universal-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private _router: Router,
        private _auth: AuthService,
        private _cookies: UniversalStorageService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this._auth.fnGetToken() && !request.headers.has('x-access-token')) {
            if (request.url.startsWith(environment.API_URL)) {
                request = request.clone({
                    setHeaders: {
                        'x-access-token': `${this._auth.fnGetToken()}`
                    }
                });
            }
        }
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 401:
                            this._auth.fnRemoveToken();
                            this._router.navigate(['/login']);
                            break;
                        case 403:
                            this._router.navigate(['/login']);
                            break;
                        default:
                    }
                }
            })
        );
    }
}
