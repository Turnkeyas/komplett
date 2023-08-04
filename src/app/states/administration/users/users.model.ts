import { USERROLES } from '../../../core/constants/constants';
export interface AdminUserFetchOptions {
  sort: String;
  limit: Number;
  page: Number;
  order: 'acs' | 'des';
  role: String;
}

export interface AdminUsersModel {
  users: any,
  isLoading: boolean,
  adminUserFetchOptions: AdminUserFetchOptions;
  isPasswordChange: boolean;
}

export const AdminUsers: AdminUsersModel = {
  users: [],
  isLoading: false,
  adminUserFetchOptions: {
    role: USERROLES.ADMIN,
    limit: 10,
    order: 'acs',
    page: 1,
    sort: 'createdAt',
  },
  isPasswordChange: false
}
