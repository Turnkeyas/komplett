import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.state';
import { AuthService } from 'src/app/services/custom/auth-service/auth.service';
import { Observable, Subject } from 'rxjs';
import { UserModel } from '../../core/models/user-model';
import { UserFacade } from '../../states/user';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  authUser$: Observable<UserModel> = this._userFacade.authUser$;
  public isMenuCollapsed: boolean = false;
  public loggedInUser: any;
  private ngUnsubscribe = new Subject();
  public languages = [
    { name: 'English', flag: './assets/img/flag/united-states.svg', isSelected: false },
    { name: 'Norwegian', flag: './assets/img/flag/norway.svg', isSelected: true }
  ];

  constructor(private _router: Router, private _state: AppState, private _auth: AuthService,
    public translate: TranslateService,
    private _userFacade: UserFacade) {
    this.loggedInUser = null;

    translate.addLangs(['English', 'Norwegian']);
    translate.setDefaultLang('Norwegian');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|Norwegian/) ? browserLang : 'Norwegian');

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  setLanguage(value: any) {
    this.translate.use(value.name);
    this.languages.forEach(language => {
      if (language.name === value.name) {
        language.isSelected = true;
      } else {
        language.isSelected = false;
      }
    })
  }

  ngOnInit() {
    this.fnGetLoginUser();
  }

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


  public closeSubMenus() {
    /* when using <az-sidebar> instead of <az-menu> uncomment this line */
    // this._sidebarService.closeAllSubMenus();
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  }

  fnLogout() {
    this._auth.fnRemoveToken();
    this._router.navigate(['login']);
  }
}
