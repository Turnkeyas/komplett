import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdminUserFetchOptions } from './users.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  readonly apiUrl = environment.TABLE_API_URL + 'users/';

  constructor(private _http: HttpClient) {}

  fetchUsers(options: AdminUserFetchOptions) {
    const url = this.apiUrl + '?role=' + options.role;
    return this._http.get(url);
  }

  insertUser(payload) {
    return this._http.post(this.apiUrl, payload);
  }

  deleteUser(id) {
    return this._http.delete(this.apiUrl + id);
  }

  updateUser(payload) {
    return this._http.put(this.apiUrl, payload);
  }

  fnChangePassword(payload: any, id: string): any {
    return this._http.put(this.apiUrl + id + '/change-password', payload);
  }
}
