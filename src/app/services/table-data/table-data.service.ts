import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class TableDataService {
  apiUrl: string = environment.TABLE_API_URL + '?limit=10&page=1';

  constructor(private _http: HttpClient) { }

  fnInsertTableData(payload: any) {
    return this._http.post(environment.TABLE_API_URL + 'insert', payload);
  }

  fnGetTableData(params: { type: string, option?: string }) {
    return this._http.get(environment.TABLE_API_URL + '?type=' + params.type + params.option);
  }

  fnUpdateTableData(payload) {
    return this._http.put(environment.TABLE_API_URL + 'update', payload).toPromise();
  }

  fnDeleteTableData(id) {
    return this._http.delete(environment.TABLE_API_URL + `delete/${id}`);
  }

  getTableData(url = this.apiUrl) {
    return this._http.get(url);
  }
}
