export class CompanySettingsFetchAction {
  static readonly type = '[CompanySettings] CompanySettingsFetchAction';
  constructor() { }
}

export class CompanySettingsUpdateAction {
  static readonly type = '[CompanySettings] CompanySettingsUpdateAction';
  constructor(public payload: any) { }
}
