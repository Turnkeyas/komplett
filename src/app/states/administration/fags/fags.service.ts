import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FagsService {
  readonly apiUrl = environment.TABLE_API_URL + 'fag/';

  constructor(private _http: HttpClient) { }

  fetchFags() {
    const url = this.apiUrl;
    return this._http.get(url);
  }

  insertFag(payload) {
    return this._http.post(this.apiUrl, payload);
  }

  deleteFag(id) {
    return this._http.delete(this.apiUrl + id);
  }

  updateFag(payload) {
    return this._http.put(this.apiUrl, payload);
  }

  checkFagUsage(payload) {
    return this._http.get(this.apiUrl + payload + '/check').toPromise();
  }

  replacefag(payload) {
    return this._http.post(this.apiUrl + '/replaceFag', payload);
  }
}
