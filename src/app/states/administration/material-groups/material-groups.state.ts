import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { MaterialGroupsService } from './material-groups.service';
import {
  AddMaterialGroupAction,
  AddMaterialSubgroupAction,
  DeleteMaterialGroupAction,
  DeleteMaterialSubgroupAction,
  FetchMaterialGroupsAction,
  UpdateMaterialGroupAction,
  UpdateMaterialSubgroupAction,
} from './material-groups.action';
import {
  MaterialGroupsStateModel,
  DefaultMaterialGroupsModel,
} from './material-groups.model';

@State<MaterialGroupsStateModel>({
  name: 'materialGroups',
  defaults: DefaultMaterialGroupsModel,
})
@Injectable()
export class MaterialGroupsState {
  constructor(
    private _materialGroupsService: MaterialGroupsService,
    private _toastr: ToastrService
  ) {}

  @Selector()
  static getMaterialGroups(state: MaterialGroupsStateModel) {
    return state.materialGroups;
  }

  @Selector()
  static getIsLoading(state: MaterialGroupsStateModel) {
    return state.isLoading;
  }

  @Action(FetchMaterialGroupsAction)
  FetchMaterialGroupsAction(
    { patchState }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.fetchMaterialGroups(payload).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false, materialGroups: res });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(AddMaterialGroupAction)
  AddMaterialGroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.addMaterialGroup(payload).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(UpdateMaterialGroupAction)
  UpdateMaterialGroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.updateMaterialGroup(payload).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(DeleteMaterialGroupAction)
  DeleteMaterialGroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.deleteMaterialGroup(payload?.id).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  // Material Sub Group Actions

  @Action(AddMaterialSubgroupAction)
  AddMaterialSubgroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.addMaterialSubgroup(payload).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(UpdateMaterialSubgroupAction)
  UpdateMaterialSubgroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.updateMaterialSubgroup(payload).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(DeleteMaterialSubgroupAction)
  DeleteMaterialSubgroupAction(
    { patchState, dispatch }: StateContext<MaterialGroupsStateModel>,
    { payload }
  ) {
    patchState({ isLoading: true });
    return this._materialGroupsService.deleteMaterialSubgroup(payload?.id).pipe(
      tap(
        (res) => {
          patchState({ isLoading: false });
          dispatch(new FetchMaterialGroupsAction(payload?.category));
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }
}
