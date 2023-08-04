import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import * as moment from 'moment';
import * as _ from 'lodash';

import {
  LoginFormSubmitAction, ResetFormStateAction,
  SignUpFormSubmitAction,
  SubMaterialFormSubmitAction,
} from './form.action';
import { Injectable } from '@angular/core';
import { FormStateModel, DefaultFormStateModel } from './form.model';
import { LoginAction, SignUpAction } from '../account/account.action';
import { SubMaterialSubmitAction, TableFetchAction, TableService } from '../table';
import { tap } from 'rxjs/operators';

@State<FormStateModel>({
  name: 'form',
  defaults: DefaultFormStateModel,
})

@Injectable()
export class FormState {
  constructor(
    private _store: Store,
    private _tableService: TableService
  ) {
  }

  @Action(LoginFormSubmitAction)
  LoginFormSubmitAction({ getState }: StateContext<any>) {
    const state: FormStateModel = getState();

    if (state && state.login && state.login.model) {
      this._store.dispatch(new LoginAction(state.login.model));
    }
  }

  @Action(SignUpFormSubmitAction)
  SignUpFormSubmitAction({ getState }: StateContext<any>) {
    const state = getState();

    if (state && state.signup && state.signup.model) {
      const model: any = state.signup.model;

      if (model.confirmPassword) {
        delete model.confirmPassword;
      }
      this._store.dispatch(new SignUpAction(model));
    }
  }

  @Action(ResetFormStateAction)
  ResetFormStateAction({ getState, setState }: StateContext<any>) {
    setState(DefaultFormStateModel);
  }

  @Action(SubMaterialFormSubmitAction)
  SubMaterialFormSubmitAction({ getState }: StateContext<any>) {
    const state = getState();
    if (state && state.subMaterial && state.subMaterial.model) {
      const model: any = state.subMaterial.model;
      this._store.dispatch(new SubMaterialSubmitAction(model));
    }
  }

}
