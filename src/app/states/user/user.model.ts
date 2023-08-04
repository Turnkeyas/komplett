import { UserModel } from '../../core/models/user-model';

export interface UserStateModel {
    authUser: UserModel;
}

export const DefaultUserStateModel: UserStateModel = {
    authUser: null
};
