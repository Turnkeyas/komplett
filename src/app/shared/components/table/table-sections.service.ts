import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableSectionsService {
  apiUrl = environment.TABLE_API_URL;

  constructor(private _http: HttpClient) {}

  getTableSectionsData() {
    const url =
      'https://sdf-34-sgsgs4-43sdfs34.herokuapp.com/api/material';
    return this._http.get(url).toPromise();
  }

  getReportData(type?: string) {
    // let url = `${this.apiUrl}report?type=${type}`;
    let url = `${this.apiUrl}report`;
    return this._http.get(url).toPromise();
  }
}
