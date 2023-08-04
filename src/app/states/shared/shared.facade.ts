import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AddSubMaterialDetailAction, DeleteFDVDocumentAction, FetchOfferTemplateAction, UpdateOfferTemplateAction } from "./shared.action";
import { SharedState } from "./shared.state";

@Injectable()
export class SharedStateFacade {
  @Select(SharedState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(SharedState.getOfferTemplate) getOfferTemplate$: Observable<any>;
  @Select(SharedState.getsubMaterialDetail) subMaterialDetail$: Observable<any>;

  constructor(private _store: Store) { }

  fetchOfferTemplate() {
    return this._store.dispatch(new FetchOfferTemplateAction());
  }

  updateOfferTemplate(payload: any) {
    return this._store.dispatch(new UpdateOfferTemplateAction(payload));
  }

  addSubMaterialDetail(payload: any) {
    return this._store.dispatch(new AddSubMaterialDetailAction(payload));
  }

  deleteFDVDocument(payload: any, isEditMasterMaterial: boolean) {
    return this._store.dispatch(new DeleteFDVDocumentAction(payload, isEditMasterMaterial));
  }
}
