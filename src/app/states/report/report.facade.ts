import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { FetchReportDataAction } from "./report.action";
import { ReportState } from "./report.state";

@Injectable()
export class ReportFacade {
  @Select(ReportState.getIsLoading) isLoading$: Observable<boolean>;
  @Select(ReportState.getReportdata) getReportdata$: Observable<any>;

  constructor(private _store: Store) { }

  fetchReportData(type?) {
    return this._store.dispatch(new FetchReportDataAction(type));
  }
}
