import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AccountFacade, AccountState } from './account';
import { FormFacade, FormState } from './form';
import { UserFacade, UserState } from './user';
import { TableState } from './table';
import { SharedState, SharedStateFacade } from './shared';
import { TableFacade } from './index';
import { MasterMaterialFacade, MasterMaterialState } from './master-material';
import { AdminUsersFacade, AdminUsersState } from './administration/users';
import { FagsFacade, FagsState } from './administration/fags';
import { CompanySettingsFacade, CompanySettingsState } from './administration/company-settings';
import { ReportState } from './report/report.state';
import { ReportFacade } from './report/report.facade';
import { MaterialGroupsFacade, MaterialGroupsState } from './administration/material-groups/index'

const STATES = [
  AccountState,
  FormState,
  UserState,
  TableState,
  MasterMaterialState,
  SharedState,
  AdminUsersState,
  FagsState,
  CompanySettingsState,
  ReportState,
  MaterialGroupsState
];

@NgModule({
  imports: [
    NgxsModule.forRoot(STATES),
    NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    AccountFacade,
    FormFacade,
    UserFacade,
    TableFacade,
    MasterMaterialFacade,
    SharedStateFacade,
    AdminUsersFacade,
    FagsFacade,
    CompanySettingsFacade,
    ReportFacade,
    MaterialGroupsFacade
  ],
})
export class StateModule { }
