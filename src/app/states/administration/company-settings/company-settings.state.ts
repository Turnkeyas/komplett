import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { CompanySettingsFetchAction, CompanySettingsUpdateAction } from './company-settings.action';
import { CompanySettingsModel, DefaultCompanySettings } from './company-settings.model';
import { CompanySettingsService } from './company-settings.service';

@State<CompanySettingsModel>({
  name: 'companySettings',
  defaults: DefaultCompanySettings
})

@Injectable()
export class CompanySettingsState {
  constructor(private _companySettingsService: CompanySettingsService) { }

  @Selector()
  static getCompanySettings(state: CompanySettingsModel) {
    return state.companySettings;
  }

  @Selector()
  static getIsLoading(state: CompanySettingsModel) {
    return state.isLoading;
  }

  @Action(CompanySettingsFetchAction)
  CompanySettingsFetchAction({ getState, patchState }: StateContext<CompanySettingsModel>, { payload }) {
    patchState({ isLoading: true });
    const state = getState();
    return this._companySettingsService.fetchCompanySettings().pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false, companySettings: res });
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }


  @Action(CompanySettingsUpdateAction)
  CompanySettingsUpdateAction({ patchState }: StateContext<CompanySettingsModel>, { payload }: any) {
    patchState({ isLoading: true });
    return this._companySettingsService.updateCompanySettings(payload).pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false, companySettings: res });
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }
}