import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CheckfagUsageAction, FagDeleteAction, FagInsertAction, FagUpdateAction, FetchFagAction, ReplaceFagAction } from './fags.action';
import { FagModel } from './fags.model';
import { FagsService } from './fags.service';
import { FagsState } from './fags.state';
// import {} from  './users.state';
@Injectable()
export class FagsFacade {

  @Select(FagsState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(FagsState.checkFagUsage) checkFagUsage$: Observable<boolean>;
  @Select(FagsState.getFags) fags$: Observable<Array<any>>;

  constructor(private _fagService: FagsService, private _store: Store) { }

  fetchFags() {
    return this._store.dispatch(new FetchFagAction());
  }

  insertFag(payload) {
    return this._store.dispatch(new FagInsertAction(payload));
  }

  deleteFag(id) {
    return this._store.dispatch(new FagDeleteAction(id));
  }

  updateFag(payload) {
    return this._store.dispatch(new FagUpdateAction(payload));
  }

  checkFagUsage(payload) {
    return this._store.dispatch(new CheckfagUsageAction(payload));
  }

  replaceFag(payload) {
    return this._store.dispatch(new ReplaceFagAction(payload));
  }
}
