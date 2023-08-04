import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AccountState } from './account.state';
import { CreatePasswordAction, ResetAccountStateAction } from './account.action';


@Injectable()
export class AccountFacade {
  @Select(AccountState.getIsLoading) isLoading$: Observable<boolean>;

  constructor(private _store: Store) { }

  resetAccountStateAction() {
    return this._store.dispatch(new ResetAccountStateAction());
  }

  createPassword(payload: any): any {
    return this._store.dispatch(new CreatePasswordAction(payload));
  }
}
