import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TableFetchAction, SetTableFetchOption, SubMaterialSubmitAction, SetActiveTableNameAction, DeleteMaterialDataAction, DeleteSubMaterialDataAction, SubMaterialDocumentUploadAction, clearAllQtyAction, reorderAction } from './table.action';
import { TableFetchOptions } from './table.model';
import { TableState } from './table.state';

@Injectable()
export class TableFacade {
    @Select(TableState.getTableData) tableData$: Observable<any>;
    @Select(TableState.getIsLoading) isLoading$: Observable<boolean>;
    @Select(TableState.getActiveTableName) activeTableName$: Observable<string>;
    @Select(TableState.getIsDocumentUploading) getIsDocumentUploading$: Observable<boolean>;

    constructor(private _store: Store) { }

    fetchTableData() {
        return this._store.dispatch(new TableFetchAction());
    }

    setTableFetchOption(payload: TableFetchOptions) {
        this._store.dispatch(new SetTableFetchOption(payload));
    }

    uploadDocumentInSubMaterial(payload , isEditMasterMaterial) {
        return this._store.dispatch(new SubMaterialDocumentUploadAction(payload, isEditMasterMaterial));
    }

    subMaterialSubmitAction(payload: any) {
        return this._store.dispatch(new SubMaterialSubmitAction(payload));
    }

    setActiveTableNameAction(payload: any) {
        return this._store.dispatch(new SetActiveTableNameAction(payload));
    }

    deleteMaterialDataAction(payload: any) {
        return this._store.dispatch(new DeleteMaterialDataAction(payload));
    }

    deleteSubMaterialDataAction(payload: string) {
        return this._store.dispatch(new DeleteSubMaterialDataAction(payload));
    }

    clearAllQtyAction(){
        return this._store.dispatch(new clearAllQtyAction());
    }

    reorderAction(payload: any){
        return this._store.dispatch(new reorderAction(payload));
    }
}
