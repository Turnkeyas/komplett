import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { FagDeleteAction, FetchFagAction, FagUpdateAction, FagInsertAction, CheckfagUsageAction, ReplaceFagAction } from './fags.action';
import { FagModel, DefaultFags } from './fags.model';
import { tap } from 'rxjs/operators';
import { FagsService } from './fags.service';

@State<FagModel>({
  name: 'fags',
  defaults: DefaultFags
})

@Injectable()
export class FagsState {
  constructor(private _fagService: FagsService, private _store: Store) { }

  @Selector()
  static getFags(state: FagModel) {
    return state.fags;
  }

  @Selector()
  static getIsLoading(state: FagModel) {
    return state.isLoading;
  }

  @Selector()
  static checkFagUsage(state: FagModel) {
    return state.isFagUsed;
  }

  @Action(FetchFagAction)
  FetchFagAction({ dispatch, getState, setState, patchState }: StateContext<FagModel>, { payload }) {
    patchState({ isLoading: true });
    const state = getState();
    return this._fagService.fetchFags().pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false, fags: res });
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }


  @Action(FagUpdateAction)
  FagUpdateAction({ getState, patchState, dispatch }: StateContext<FagModel>, { payload }: any) {
    patchState({ isLoading: true });
    let gState = getState();
    return this._fagService.updateFag(payload).pipe(
      tap(
        (res: any) => {
          if (res._id) {
            const fags = gState.fags;
            fags.forEach((e, i) => {
              if (e._id === res._id) {
                fags[i] = res;
              }
            });
            patchState({ fags });
            let state = getState();
            const d = state.fags.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
            patchState({ isLoading: false });
          } else {
            dispatch(new FetchFagAction());
          }
        },
        err => {
          patchState({ isLoading: false });
        }
      )
    );
  }

  @Action(FagInsertAction)
  FagInsertAction({ getState, patchState, dispatch }: StateContext<FagModel>, { payload }: any) {
    patchState({ isLoading: true });
    return this._fagService.insertFag(payload).pipe(
      tap(
        (res: any) => {
          if (res._id) {
            let state = getState();
            patchState({ fags: [...state.fags, res] });
            state = getState();
            const d = state.fags.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
            patchState({ isLoading: false });
          } else {
            dispatch(new FetchFagAction());
          }
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }

  @Action(FagDeleteAction)
  FagDeleteAction({ getState, patchState, dispatch }: StateContext<FagModel>, { payload }: any) {
    patchState({ isLoading: true });
    const state = getState();
    return this._fagService.deleteFag(payload).pipe(
      tap(
        (res: any) => {
          if (res._id) {
            const index = state.fags.findIndex(e => e._id === res._id);
            const fags = state.fags;
            fags.splice(index, 1);
            patchState({ isLoading: false, fags: fags })
          } else {
            dispatch(new FetchFagAction())
          }
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }

  // @Action(CheckfagUsageAction)
  // CheckfagUsageAction({ patchState }: StateContext<FagModel>, { payload }) {
  //   patchState({ isLoading: true });
  //   return this._fagService.checkFagUsage(payload).pipe(
  //     tap(
  //       (res: any) => {
  //         patchState({ isLoading: false, isFagUsed: true });
  //       },
  //       err => {
  //         patchState({ isLoading: false })
  //       }
  //     )
  //   );
  // }

  @Action(ReplaceFagAction)
  ReplaceFagAction({ patchState }: StateContext<FagModel>, { payload }) {
    patchState({ isLoading: true });
    return this._fagService.replacefag(payload).pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false });
          this._store.dispatch(new FagDeleteAction(payload.oldFagId));
        },
        err => {
          patchState({ isLoading: false })
        }
      )
    );
  }
}
