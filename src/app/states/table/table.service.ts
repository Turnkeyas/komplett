import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableFetchOptions } from './table.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  readonly apiUrl = environment.TABLE_API_URL + 'material';
  constructor(private _http: HttpClient) {}

  getTableData(options: TableFetchOptions) {
    const url = this.apiUrl;
    const params: any = options;
    return this._http.get(url, { params });
  }

  uploadDocumentInSubMaterial(data: any, isMasterMaterial: boolean) {
    let url = this.apiUrl + '/subMaterial/document';
    if (isMasterMaterial) {
      url = environment.TABLE_API_URL + 'master-materials/document';
    }

    return this._http.post<any>(url, data);
  }

  updateSubMaterial(payload: any) {
    const url = this.apiUrl + '/subMaterial';
    return this._http.put<any>(url, payload);
  }

  deleteMaterialData(payload: any) {
    const url = this.apiUrl + '/' + payload;
    return this._http.delete(url);
  }

  deleteSubMaterialData(payload: string) {
    const url = this.apiUrl + '/subMaterial/' + payload;
    return this._http.delete(url);
  }

  clearAllQty() {
    const url = this.apiUrl + '/clear-quantity';
    return this._http.get(url);
  }

  reorder(payload) {
    const url = this.apiUrl + '/reorder';
    return this._http.put<any>(url, payload);
  }
}
