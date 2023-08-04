import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import {
  CreatePasswordAction,
  LoginAction,
  LogoutAccountAction, ResetAccountStateAction,
  SignUpAction,
} from './account.action';
import { AccountStateModel, DefaultAccountStateModel } from './account.model';
import { Injectable, NgZone } from '@angular/core';
import { AccountService } from './account.service';
import { AuthTokenModel } from '../../core/models/auth-model';
import { AuthService } from '../../services/custom/auth-service/auth.service';
import { ToastrService } from '../../shared/services/toastr-sevice/toastr.service';

@State<AccountStateModel>({
  name: 'account',
  defaults: DefaultAccountStateModel,
})

@Injectable()
export class AccountState {

  constructor(
    private _store: Store,
    private _accountService: AccountService,
    private _auth: AuthService,
    private _router: Router,
    private _toastr: ToastrService,
    private zone: NgZone
  ) {
  }

  @Selector()
  static getIsLoading(state) {
    return state.isLoading;
  }


  @Action(LoginAction)
  LoginAction({ getState, setState }: StateContext<AccountStateModel>, { payload }: LoginAction) {
    const state = getState();
    setState({ ...state, isLoading: true });
    return this._accountService.fnSignIn(payload).pipe(tap((result: AuthTokenModel) => {
      setState({ ...state, isLoading: false });
      if (result && result.token) {
        this._auth.fnSetToken(result.token);
        this._auth.fnGetAuthUser();
        setState({ ...state, auth: result });
        this._toastr.success('You have logged in successfully');
        this.zone.run(() => {
          this._router.navigate(['/offer-template']);
        });
      }
    }, (err) => {
      setState({ ...state, isLoading: false });
      this._toastr.error(err.error.message);
    }));
  }

  @Action(SignUpAction)
  SignUpAction({ getState, setState }: StateContext<AccountStateModel>, { payload }: SignUpAction) {
    const state = getState();
    setState({ ...state, isLoading: true });
    return this._accountService.fnSignUp(payload).pipe(tap((result: any) => {
      setState({ ...state, isLoading: false, auth: result });
      this._router.navigate(['/login']);
    }, (err) => {
      setState({ ...state, isLoading: false });
      this._toastr.error(err.error.message);
    }));
  }

  @Action(LogoutAccountAction)
  LogoutAccountAction({ getState, setState }: StateContext<AccountStateModel>) {
    const state = getState();
    setState({ ...state, auth: null });
  }


  @Action(ResetAccountStateAction)
  ResetAccountStateAction({ getState, setState }: StateContext<AccountStateModel>) {
    const state = getState();
    setState({
      ...state,
      auth: null,
    });
  }

  @Action(CreatePasswordAction)
  CreatePasswordAction({ patchState }: StateContext<AccountStateModel>, { payload }: any): any {
    patchState({ isLoading: true });
    return this._accountService.fnCreatePassword(payload).pipe(tap((result: any) => {
      if (result) {
        this._router.navigate(['login']);
        patchState({ isLoading: false });
        this._toastr.success('Your password created', 'Success');
      }
    }, (err) => {
      this._toastr.error('Something went wrong', 'Error');
      patchState({ isLoading: false });
    }));
  }
}
