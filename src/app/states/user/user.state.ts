import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';

import {
    GetAuthUserAction
} from './user.action';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { UserStateModel, DefaultUserStateModel } from './user.model';

@State<UserStateModel>({
    name: 'user',
    defaults: DefaultUserStateModel,
})

@Injectable()
export class UserState {

    constructor(
        private _userService: UserService
    ) {
    }


    @Selector()
    static getAuthUser(state: UserStateModel) {
        return state.authUser;
    }

    @Action(GetAuthUserAction)
    GetAuthUserAction({ getState, patchState }: StateContext<UserStateModel>, { id }: GetAuthUserAction) {
        return this._userService.getUser(id).pipe(tap((result) => {
            const state = getState();
            patchState({ authUser: result });
        }));
    }
}
