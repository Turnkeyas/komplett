import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddMaterialGroupAction,
  AddMaterialSubgroupAction,
  DeleteMaterialGroupAction,
  DeleteMaterialSubgroupAction,
  FetchMaterialGroupsAction,
  UpdateMaterialGroupAction,
  UpdateMaterialSubgroupAction,
} from './material-groups.action';
import { MaterialGroupsState } from './material-groups.state';

@Injectable()
export class MaterialGroupsFacade {
  @Select(MaterialGroupsState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(MaterialGroupsState.getMaterialGroups) materialGroups$: Observable<
    Array<any>
  >;

  constructor(private _store: Store) {}

  fetchMaterialGroups(payload: any) {
    return this._store.dispatch(new FetchMaterialGroupsAction(payload));
  }

  AddMaterialGroup(payload: any) {
    return this._store.dispatch(new AddMaterialGroupAction(payload));
  }

  UpdateMaterialGroup(payload: any) {
    return this._store.dispatch(new UpdateMaterialGroupAction(payload));
  }

  DeleteMaterialGroup(payload: any) {
    return this._store.dispatch(new DeleteMaterialGroupAction(payload));
  }

  addMaterialSubGroup(payload: any) {
    return this._store.dispatch(new AddMaterialSubgroupAction(payload));
  }

  updateMaterialSubGroup(payload: any) {
    return this._store.dispatch(new UpdateMaterialSubgroupAction(payload));
  }

  deleteMaterialSubGroup(payload: any) {
    return this._store.dispatch(new DeleteMaterialSubgroupAction(payload));
  }
}
