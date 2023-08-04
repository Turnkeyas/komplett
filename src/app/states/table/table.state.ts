import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { TableStateModel, DefaultTableStateModel } from './table.model';
import {
  TableFetchAction,
  SetTableFetchOption,
  SubMaterialSubmitAction,
  SetActiveTableNameAction,
  DeleteMaterialDataAction,
  DeleteSubMaterialDataAction,
  SubMaterialDocumentUploadAction,
  clearAllQtyAction,
  reorderAction,
} from './table.action';
import { tap } from 'rxjs/operators';
import { TableService } from './table.service';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { AddSubMaterialDetailAction } from '../shared';
import { MasterMaterialFetchAction } from '../master-material';

@State<TableStateModel>({
  name: 'table',
  defaults: DefaultTableStateModel,
})
@Injectable()
export class TableState {
  constructor(private _tableService: TableService, private store: Store) {}
  @Selector()
  static getTableData(state: TableStateModel) {
    return state.tableData;
  }

  @Selector()
  static getIsLoading(state: TableStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getActiveTableName(state: TableStateModel) {
    return state.activeTableName;
  }

  @Selector()
  static getIsDocumentUploading(state: TableStateModel) {
    return state.isDocumentUploading;
  }

  @Action(TableFetchAction)
  TableFetchAction({
    dispatch,
    getState,
    setState,
    patchState,
  }: StateContext<TableStateModel>) {
    patchState({ isLoading: true });

    const state = getState();
    if (state.tableOptions) {
      return this._tableService.getTableData(state.tableOptions).pipe(
        tap(
          (res) => {
            patchState({ isLoading: false, tableData: res });
          },
          (err) => {
            patchState({ isLoading: false });
          }
        )
      );
    }
  }

  @Action(SetTableFetchOption)
  SetTableFetchOption(
    { patchState, setState, getState }: StateContext<TableStateModel>,
    { payload }: SetTableFetchOption
  ) {
    patchState({ tableOptions: payload });
  }

  @Action(DeleteMaterialDataAction)
  DeleteMaterialDataAction(
    { patchState, dispatch, setState, getState }: StateContext<TableStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    const state = getState();

    return this._tableService.deleteMaterialData(payload).pipe(
      tap(
        (res) => {
          // for get update table data
          dispatch(new TableFetchAction());
          patchState({ isLoading: false });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(DeleteSubMaterialDataAction)
  DeleteSubMaterialDataAction(
    { patchState, dispatch, setState, getState }: StateContext<TableStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    const state = getState();

    return this._tableService.deleteSubMaterialData(payload).pipe(
      tap(
        (res) => {
          // for get update table data
          dispatch(new TableFetchAction());
          patchState({ isLoading: false });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(SubMaterialSubmitAction)
  SubMaterialSubmitAction(
    { patchState, setState, getState, dispatch }: StateContext<TableStateModel>,
    { payload }: SubMaterialSubmitAction
  ) {
    patchState({ isLoading: true });
    const state = getState();

    return this._tableService.updateSubMaterial(payload).pipe(
      tap(
        (res) => {
          // for get update table data
          dispatch(new TableFetchAction());
          patchState({ isLoading: false });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(SubMaterialDocumentUploadAction)
  SubMaterialDocumentUploadAction(
    { patchState, setState, getState, dispatch }: StateContext<TableStateModel>,
    { payload, isMasterMaterial }: any
  ) {
    patchState({ isDocumentUploading: true });
    const state = getState();
    return this._tableService
      .uploadDocumentInSubMaterial(payload, isMasterMaterial)
      .pipe(
        tap(
          (res) => {
            if (isMasterMaterial) {
              dispatch(new MasterMaterialFetchAction());
            } else {
              dispatch(new TableFetchAction());
            }
            dispatch(new AddSubMaterialDetailAction(res));
            patchState({ isDocumentUploading: false });
          },
          (err) => {
            patchState({ isDocumentUploading: false });
          }
        )
      );
  }

  @Action(clearAllQtyAction)
  clearAllQtyAction({
    dispatch,
    getState,
    setState,
    patchState,
  }: StateContext<TableStateModel>) {
    patchState({ isLoading: true });

    const state = getState();

    return this._tableService.clearAllQty().pipe(
      tap(
        (res) => {
          dispatch(new TableFetchAction());
          patchState({ isLoading: false });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(reorderAction)
  reorderAction(
    { dispatch, getState, setState, patchState }: StateContext<TableStateModel>,
    { payload }: any
  ) {
    patchState({ isLoading: true });
    return this._tableService.reorder(payload).pipe(
      tap(
        (res) => {
          dispatch(new TableFetchAction());
          patchState({ isLoading: false });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }
}
