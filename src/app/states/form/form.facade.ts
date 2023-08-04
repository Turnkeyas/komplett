import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoginFormSubmitAction,
  ResetFormStateAction,
  SignUpFormSubmitAction,
} from './form.action';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { SubMaterialSubmitAction } from '../table/table.action';

@Injectable()
export class FormFacade {
  constructor(private _store: Store) {}

  loginFormSubmitAction() {
    return this._store.dispatch(new LoginFormSubmitAction());
  }

  signUpFormSubmitAction() {
    return this._store.dispatch(new SignUpFormSubmitAction());
  }

  resetFormStateAction() {
    return this._store.dispatch(new ResetFormStateAction());
  }

  subMaterialFormSubmitAction(payload: any) {
    return this._store.dispatch(new SubMaterialSubmitAction(payload));
  }

  updateFormValue(value: any, path: string, propertyPath?: string) {
    return this._store.dispatch(
      new UpdateFormValue({
        value,
        path,
        propertyPath,
      })
    );
  }
}
