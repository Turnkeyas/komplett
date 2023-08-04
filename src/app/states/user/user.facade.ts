import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from './user.state';
import {
  GetAuthUserAction
} from './user.action';
import { UserModel } from '../../core/models/user-model';

@Injectable()
export class UserFacade {
  @Select(UserState.getAuthUser) authUser$: Observable<UserModel>;

  constructor(private _store: Store) {
  }

}
