import {AuthTokenModel} from '../../core/models/auth-model';

export interface AccountStateModel {
    auth: AuthTokenModel;
    isLoading: boolean;
}

export const DefaultAccountStateModel: AccountStateModel = {
    auth: null,
    isLoading: false,
};
