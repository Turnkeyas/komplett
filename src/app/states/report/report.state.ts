import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ReportStateService } from './report.service';
import { tap } from 'rxjs/operators';
import { TableFetchAction } from '../table';
import { DefaultReportStateModel, ReportStateModel } from './report.model';
import { FetchReportDataAction } from './report.action';

@State<ReportStateModel>({
  name: 'report',
  defaults: DefaultReportStateModel,
})
@Injectable()
export class ReportState {
  @Selector()
  static getIsLoading(state: ReportStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getReportdata(state: ReportStateModel) {
    return state.reportData;
  }

  constructor(private _reportStateService: ReportStateService) {}

  @Action(FetchReportDataAction)
  FetchReportDataAction(
    { patchState }: StateContext<ReportStateModel>,
    { type }
  ) {
    patchState({ isLoading: true });
    return this._reportStateService.getReportData(type).pipe(
      tap(
        (res: any) => {
          patchState({ isLoading: false, reportData: res });
        },
        (err) => {
          patchState({ isLoading: false });
        }
      )
    );
  }
}
