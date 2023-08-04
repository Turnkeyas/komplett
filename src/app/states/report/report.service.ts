import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportStateService {
  apiUrl = environment.TABLE_API_URL;

  constructor(private _http: HttpClient) {}

  getReportData(type?) {
    let url = this.apiUrl + 'report';
    if (type) {
      url = `${url}?type=${type}`;
    }
    return this._http.get(url);
  }
}
