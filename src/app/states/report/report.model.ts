export interface ReportStateModel {
  isLoading: boolean;
  reportData: any;
}

export const DefaultReportStateModel: ReportStateModel = {
  isLoading: false,
  reportData: {}
}
