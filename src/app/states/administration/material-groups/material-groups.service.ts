import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialGroupsService {
  readonly apiUrl = environment.TABLE_API_URL + 'material-groups';

  constructor(private _http: HttpClient) {}

  fetchMaterialGroups(payload: any) {
    return this._http.get(this.apiUrl + '?category=' + payload);
  }

  addMaterialGroup(payload) {
    return this._http.post(this.apiUrl, payload);
  }

  updateMaterialGroup(payload) {
    return this._http.put(this.apiUrl, payload);
  }

  deleteMaterialGroup(id) {
    return this._http.delete(this.apiUrl + '/' + id);
  }

  addMaterialSubgroup(payload) {
    return this._http.post(this.apiUrl + '/subgroup', payload);
  }

  updateMaterialSubgroup(payload) {
    return this._http.put(this.apiUrl + '/subgroup', payload);
  }

  deleteMaterialSubgroup(id) {
    return this._http.delete(this.apiUrl + '/subgroup/' + id);
  }
}
