import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddMasterMaterialDataAction, AddMaterialDataAction, SubMaterialListFetchAction, SetMasterMaterialFetchOption, DeleteMasterMaterialDataAction, MasterMaterialFetchAction, EditMasterMaterialDataAction, AddSubMaterialsAction, FetchFagDataAction, EditMaterialDataAction } from './master-material.action';
import { MasterMaterialFetchOptions } from './master-material.model';
import { MasterMaterialState } from './master-material.state';

@Injectable()
export class MasterMaterialFacade {
    @Select(MasterMaterialState.getSubMaterialList) subMaterialListData$: Observable<any>;
    @Select(MasterMaterialState.getMasterMaterialData) masterMaterialData$: Observable<any>;
    @Select(MasterMaterialState.getIsLoading) isLoading$: Observable<boolean>;
    @Select(MasterMaterialState.getFagList) fagList$: Observable<boolean>;

    constructor(private _store: Store) { }

    fetchSubMaterialData(payload: any) {
        return this._store.dispatch(new SubMaterialListFetchAction(payload));
    }

    setMasterMaterialFetchOption(payload: MasterMaterialFetchOptions) {
        return this._store.dispatch(new SetMasterMaterialFetchOption(payload));
    }

    fetchMasterMaterialData() {
        return this._store.dispatch(new MasterMaterialFetchAction());
    }

    addMaterialData(payload: any) {
        return this._store.dispatch(new AddMaterialDataAction(payload));
    }

    editMaterialData(payload: any) {
        return this._store.dispatch(new EditMaterialDataAction(payload));
    }

    addSubMaterials(payload: any) {
        return this._store.dispatch(new AddSubMaterialsAction(payload));
    }

    addMasterMaterialData(payload: any) {
        return this._store.dispatch(new AddMasterMaterialDataAction(payload));
    }

    editMasterMaterialData(payload: any) {
        return this._store.dispatch(new EditMasterMaterialDataAction(payload));
    }

    deleteMasterMaterialData(payload: any) {
        return this._store.dispatch(new DeleteMasterMaterialDataAction(payload));
    }

    /** Fag */

    fetchFagData() {
        return this._store.dispatch(new FetchFagDataAction());
    }
}
