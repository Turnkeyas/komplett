import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngxs/store';
import { MasterMaterialFetchOptions } from './master-material.model';

@Injectable({
  providedIn: 'root'
})
export class MasterMaterialService {
  readonly apiUrl = environment.TABLE_API_URL;
  constructor(private _http: HttpClient, private store: Store) { }

  getMasterMaterialData(options: MasterMaterialFetchOptions) {
    const url = this.apiUrl +
      'master-materials' + '?category=' +
      options.category + '&groupId=' + options.groupId + '&limit=' + options.limit + '&sort=' + options.sort + '&page=' + options.page + '&order=' + options.order;
    return this._http.get(url);
  }

  getSubMaterialListData(payload: any) {
    const url = this.apiUrl + 'master-materials' + '?category=' + payload;
    return this._http.get(url);
  }

  addMaterialData(payload: any) {
    const url = this.apiUrl + 'material/withsubmaterials';
    return this._http.post(url, payload);
  }

  editMaterialData(payload: any) {
    const url = this.apiUrl + 'material';
    return this._http.put(url, payload);
  }

  addSubMaterials(payload: any) {
    const url = this.apiUrl + 'material/addsubmaterials';
    return this._http.put(url, payload);
  }

  addMasterMaterialData(payload: any) {
    const url = this.apiUrl + 'master-materials';
    return this._http.post(url, payload);
  }

  editMasterMaterialData(payload: any) {
    const url = this.apiUrl + 'master-materials';
    return this._http.put(url, payload);
  }

  deleteMasterMaterialData(payload: any) {
    const url = this.apiUrl + 'master-materials' + `/${payload}`;
    return this._http.delete(url);
  }

  /** Fag */
  fetchFag() {
    const url = this.apiUrl + 'fag';
    return this._http.get(url);
  }
}
