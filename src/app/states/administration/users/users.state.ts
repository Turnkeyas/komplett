import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AdminDeleteUsersAction, AdminFetchUsersAction, AdminInsertUsersAction, AdminUpdateUsersAction, ChangePasswordAction, SetAdminUserFetchOption } from './users.action';
import { AdminUsersModel, AdminUsers, AdminUserFetchOptions } from './users.model';
import { tap } from 'rxjs/operators';
import { AdminUsersService } from './users.service';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { Router } from '@angular/router';

@State<AdminUsersModel>({
  name: 'adminUsers',
  defaults: AdminUsers
})

@Injectable()
export class AdminUsersState {
  constructor(
    private _adminUsersService: AdminUsersService,
    private _toastr: ToastrService,
    private _router: Router
  ) { }

  @Selector()
  static getUsers(state: AdminUsersModel) {
    return state.users;
  }

  @Selector()
  static getIsLoading(state: AdminUsersModel) {
    return state.isLoading;
  }

  @Selector()
  static getIsPasswordChange(state: AdminUsersModel) {
    return state.isPasswordChange;
  }

  @Action(AdminFetchUsersAction)
  AdminFetchUsersAction({ dispatch, getState, setState, patchState }: StateContext<AdminUsersModel>, { payload }) {
    patchState({ isLoading: true });
    const state = getState();
    return this._adminUsersService.fetchUsers(state.adminUserFetchOptions).pipe(
      tap(
        res => {
          patchState({ isLoading: false, users: res });
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }


  @Action(SetAdminUserFetchOption)
  SetAdminUserFetchOption({ getState, patchState }: StateContext<AdminUsersModel>, { payload }: any) {
    patchState({ adminUserFetchOptions: payload });
  }

  @Action(AdminUpdateUsersAction)
  AdminUpdateUsersAction({ getState, patchState, dispatch }: StateContext<AdminUsersModel>, { payload }: any) {
    patchState({ isLoading: true });
    const state = getState();
    return this._adminUsersService.updateUser(payload).pipe(
      tap(
        res => {
          dispatch(new AdminFetchUsersAction())
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }

  @Action(AdminInsertUsersAction)
  AdminInsertUsersAction({ getState, patchState, dispatch }: StateContext<AdminUsersModel>, { payload }: any) {
    patchState({ isLoading: true });
    const state = getState();
    return this._adminUsersService.insertUser(payload).pipe(
      tap(
        res => {
          dispatch(new AdminFetchUsersAction())
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }

  @Action(AdminDeleteUsersAction)
  AdminDeleteUsersAction({ getState, patchState, dispatch }: StateContext<AdminUsersModel>, { payload }: any) {
    patchState({ isLoading: true });
    const state = getState();
    return this._adminUsersService.deleteUser(payload).pipe(
      tap(
        res => {
          dispatch(new AdminFetchUsersAction())
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }

  @Action(ChangePasswordAction)
  CreatePasswordAction({ patchState }: StateContext<AdminUsersModel>, { payload, id }: any): any {
    patchState({ isPasswordChange: true });
    return this._adminUsersService.fnChangePassword(payload, id).pipe(tap((result: any) => {
      if (result && result.success) {
        this._router.navigate(['login']);
        patchState({ isPasswordChange: false });
      }
    }, (err) => {
      patchState({ isPasswordChange: false });
    }));
  }
}
