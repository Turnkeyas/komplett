import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AddSubMaterialDetailAction, DeleteFDVDocumentAction, FetchOfferTemplateAction, UpdateOfferTemplateAction } from './shared.action';
import { DefaultSharedStateModel, SharedStateModel } from './shared.model';
import { SharedStateService } from './shared.service';
import { tap } from 'rxjs/operators';
import { TableFetchAction } from '../table';
import { MasterMaterialFetchAction } from '../master-material';

@State<SharedStateModel>({
  name: 'sharedState',
  defaults: DefaultSharedStateModel
})

@Injectable()
export class SharedState {

  @Selector()
  static getIsLoading(state: SharedStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getOfferTemplate(state: SharedStateModel) {
    return state.offerTemplate;
  }

  @Selector()
  static getsubMaterialDetail(state: SharedStateModel) {
    return state.subMaterialDetail;
  }

  constructor(
    private _sharedStateService: SharedStateService
  ) { }

  @Action(AddSubMaterialDetailAction)
  AddSubMaterialDetailAction({ patchState, setState, getState }: StateContext<SharedStateModel>, { payload }) {
    patchState({ subMaterialDetail: payload });
  }

  @Action(FetchOfferTemplateAction)
  FetchOfferTemplateAction({ patchState }: StateContext<SharedStateModel>) {
    patchState({ isLoading: true });
    return this._sharedStateService.getSideMenuSubItems().pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false, offerTemplate: res })
        },
        err => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(UpdateOfferTemplateAction)
  UpdateOfferTemplateAction({ patchState }: StateContext<SharedStateModel>, { payload }: any) {
    patchState({ isLoading: true });
    return this._sharedStateService.updateOfferTemplate(payload).pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false })
        },
        err => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(DeleteFDVDocumentAction)
  DeleteFDVDocumentAction({ patchState, dispatch }: StateContext<SharedStateModel>, { payload, isMasterMaterial }: any) {
    patchState({ isLoading: true });
    return this._sharedStateService.deleteFDVDocument(payload, isMasterMaterial).pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false });
          dispatch(new AddSubMaterialDetailAction(res));
          if (isMasterMaterial) {
            dispatch(new MasterMaterialFetchAction());
          } else {
            dispatch(new TableFetchAction());
          }
        },
        err => {
          patchState({ isLoading: false });
        }
      )
    );
  }
}
