import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanySettingsService {
  readonly apiUrl = environment.TABLE_API_URL + 'company-settings';

  constructor(private _http: HttpClient) { }

  fetchCompanySettings() {
    const url = this.apiUrl;
    return this._http.get(url);
  }

  updateCompanySettings(payload) {
    return this._http.put(this.apiUrl, payload);
  }
}
