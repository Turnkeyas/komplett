export class AdminFetchUsersAction {
  static readonly type = '[Admin] AdminFetchUsersAction';
  constructor() { }
}

export class SetAdminUserFetchOption {
  static readonly type = '[Admin] SetAdminUserFetchOption';
  constructor(public payload: any) { }
}

export class AdminInsertUsersAction {
  static readonly type = '[Admin] AdminInsertUsersAction';
  constructor(public payload: any) { }
}

export class AdminUpdateUsersAction {
  static readonly type = '[Admin] AdminUpdateUsersAction';
  constructor(public payload: any) { }
}

export class AdminDeleteUsersAction {
  static readonly type = '[Admin] AdminDeleteUsersAction';
  constructor(public payload: any) { }
}

export class ChangePasswordAction {
  static readonly type = '[User] ChnagePassowrdAction';

  constructor(public payload: any, public id: string) {
  }
}
