import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CompanySettingsFetchAction, CompanySettingsUpdateAction } from './company-settings.action';
import { CompanySettingsState } from './company-settings.state';

@Injectable()
export class CompanySettingsFacade {

  @Select(CompanySettingsState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(CompanySettingsState.getCompanySettings) getCompanySettings$: Observable<Array<any>>;

  constructor(private _store: Store) { }

  fetchCompanySettings() {
    return this._store.dispatch(new CompanySettingsFetchAction());
  }

  updateCompanySettings(payload) {
    return this._store.dispatch(new CompanySettingsUpdateAction(payload));
  }

}
