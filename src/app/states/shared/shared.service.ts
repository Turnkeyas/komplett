import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  apiUrl = environment.TABLE_API_URL;

  constructor(private _http: HttpClient, private store: Store) { }

  getSideMenuSubItems() {
    return this._http.get(this.apiUrl + 'offer-template');
  }

  updateOfferTemplate(payload: any) {
    return this._http.put(this.apiUrl + 'offer-template', payload);
  }

  deleteFDVDocument(payload: any, isMasterMaterial: boolean) {
    let url = this.apiUrl + 'material/subMaterial/' + payload.id + '/document/delete';
    if (isMasterMaterial) {
      url = this.apiUrl + 'master-materials/' + payload.id + '/document/delete';
    }
    return this._http.delete(url);
  }

  uploadDocumentInSubMaterial(data: any, isMasterMaterial: boolean) {
    let url = this.apiUrl + '/subMaterial/document';
    if (isMasterMaterial) {
      url = environment.TABLE_API_URL + 'master-materials/document';
    }

    return this._http.post<any>(url, data);
  }
}
