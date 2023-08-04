import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { menuItems } from 'src/app/providers/side-menu';
import { UserModel } from '../../../core/models/user-model';
import { UserFacade } from '../../../states/user/user.facade';


@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate, OnDestroy {
  private ngUnsubscribe = new Subject();
  authUser$: Observable<UserModel> = this._userFacade.authUser$;
  public loggedInUser: any;

  constructor(private _userFacade: UserFacade, private _router: Router) {
    this.fnGetLoginUser();
  }

  // get details of currently logged in user
  fnGetLoginUser() {
    this.authUser$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userObj: UserModel) => {
        if (userObj) {
          this.loggedInUser = userObj;
        } else {
          this.loggedInUser = null;
        }
      });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const path = route.url[0].path;

    return new Promise((resolve, reject) => {
      if (path) {
        // check if path is there
        menuItems.forEach((item: any) => {
          // find path from path's array
          if (item.routerLink == route.url[0].path) {
            // get matching path
            if (item.authority) {
              // if the path has authority array then check if current user is
              // authorized to access the route
              if (item.authority.includes(this.loggedInUser.role)) {
                resolve(true);
              } else {
                //if not authorized then throw him on login page
                this._router.navigate(['login']);
                reject(false)
              }
            } else {
              resolve(true);
            }
          }
        })
      }
      resolve(true);
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
