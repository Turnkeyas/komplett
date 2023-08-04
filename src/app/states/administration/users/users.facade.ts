import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminDeleteUsersAction, AdminFetchUsersAction, AdminInsertUsersAction, AdminUpdateUsersAction, ChangePasswordAction, SetAdminUserFetchOption } from './users.action';
import { AdminUserFetchOptions } from './users.model';
import { AdminUsersService } from './users.service';
import { AdminUsersState } from './users.state';
// import {} from  './users.state';
@Injectable()
export class AdminUsersFacade {

  @Select(AdminUsersState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(AdminUsersState.getIsPasswordChange) isPasswordChange$: Observable<boolean>;
  @Select(AdminUsersState.getUsers) users$: Observable<Array<any>>;


  constructor(private _adminUsersService: AdminUsersService, private _store: Store) { }

  fetchUsers() {
    return this._store.dispatch(new AdminFetchUsersAction());
  }

  insertUser(payload) {
    return this._store.dispatch(new AdminInsertUsersAction(payload));
  }

  deleteUser(id) {
    return this._store.dispatch(new AdminDeleteUsersAction(id));
  }

  updateUser(payload) {
    return this._store.dispatch(new AdminUpdateUsersAction(payload));
  }

  setAdminUserFetchOption(payload: AdminUserFetchOptions) {
    return this._store.dispatch(new SetAdminUserFetchOption(payload));
  }

  changePassword(payload: any, id: string) {
    return this._store.dispatch(new ChangePasswordAction(payload, id));
  }
}
