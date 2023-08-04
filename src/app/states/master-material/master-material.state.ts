import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MasterMaterialStateModel, DefaultMasterMaterialStateModel, MasterMaterialFetchOptions } from './master-material.model';
import { AddMasterMaterialDataAction, AddMaterialDataAction, AddSubMaterialsAction, DeleteMasterMaterialDataAction, EditMasterMaterialDataAction, EditMaterialDataAction, FetchFagDataAction, MasterMaterialFetchAction, SetMasterMaterialFetchOption, SubMaterialListFetchAction } from './master-material.action';
import { tap } from 'rxjs/operators';
import { MasterMaterialService } from './master-material.service';
import { TableFetchAction } from '../table/table.action';

@State<MasterMaterialStateModel>({
    name: 'masterMaterial',
    defaults: DefaultMasterMaterialStateModel
})


@Injectable()
export class MasterMaterialState {

    constructor(private _masterMaterialService: MasterMaterialService, private store: Store) { };
    @Selector()
    static getSubMaterialList(state: MasterMaterialStateModel) {
        return state.subMaterialList;
    }

    @Selector()
    static getMasterMaterialData(state: MasterMaterialStateModel) {
        return state.materialData;
    }

    @Selector()
    static getIsLoading(state: MasterMaterialStateModel) {
        return state.isLoading;
    }

    @Selector()
    static getFagList(state: MasterMaterialStateModel) {
        return state.fagList;
    }

    @Action(SubMaterialListFetchAction)
    SubMaterialListFetchAction({ dispatch, getState, setState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.getSubMaterialListData(payload).pipe(
            tap(
                res => {
                    patchState({ isLoading: false, subMaterialList: res });
                },
                err => {
                    patchState({ isLoading: false })
                }
            )
        );
    }

    @Action(SetMasterMaterialFetchOption)
    SetMasterMaterialFetchOption({ getState, patchState }: StateContext<MasterMaterialStateModel>,
        { payload }: SetMasterMaterialFetchOption) {
        patchState({ masterMaterialOptions: payload });
    }

    @Action(MasterMaterialFetchAction)
    MasterMaterialFetchAction({ getState, patchState }: StateContext<MasterMaterialStateModel>) {
        patchState({ isLoading: true });
        const state = getState();
        if (state.masterMaterialOptions) {
            return this._masterMaterialService.getMasterMaterialData(state.masterMaterialOptions).pipe(
                tap(
                    res => {
                        patchState({ isLoading: false, materialData: res });
                    },
                    err => {
                        patchState({ isLoading: false });
                    }
                )
            );
        }
    }

    @Action(AddMaterialDataAction)
    AddMaterialDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.addMaterialData(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new TableFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }

    @Action(EditMaterialDataAction)
    EditMaterialDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.editMaterialData(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new TableFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }

    @Action(AddSubMaterialsAction)
    AddSubMaterialsAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.addSubMaterials(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new TableFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }


    @Action(EditMasterMaterialDataAction)
    EditMasterMaterialDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.editMasterMaterialData(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new MasterMaterialFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }

    @Action(AddMasterMaterialDataAction)
    AddMasterMaterialDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.addMasterMaterialData(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new MasterMaterialFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }

    @Action(DeleteMasterMaterialDataAction)
    DeleteMasterMaterialDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.deleteMasterMaterialData(payload).pipe(
            tap(
                res => {
                    this.store.dispatch(new MasterMaterialFetchAction());
                    patchState({ isLoading: false });
                },
                err => {
                    patchState({ isLoading: false });
                }
            )
        );
    }

    /**fag */
    @Action(FetchFagDataAction)
    FetchFagDataAction({ getState, patchState }: StateContext<MasterMaterialStateModel>, { payload }) {
        patchState({ isLoading: true });
        const state = getState();
        return this._masterMaterialService.fetchFag().pipe(
            tap(
                (res: any) => {
                    patchState({ isLoading: false, fagList: res });
                },
                err => {
                    patchState({ isLoading: false })
                }
            )
        );
    }
}
