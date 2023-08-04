export interface TableFetchOptions {
  sort: String;
  limit: Number | 10;
  page: Number | 1;
  order: 'acs' | 'des';
  type: String;
  division: String;
}
export interface TableStateModel {
  tableData: any;
  activeTableName: string;
  tableOptions: TableFetchOptions;
  isLoading: true | false;
  isDocumentUploading: boolean;
}

export const DefaultTableStateModel: TableStateModel = {
  tableData: null,
  activeTableName: '',
  isLoading: false,
  tableOptions: {
    type: 'Engineering',
    division: 'Bath',
    limit: 10,
    order: 'acs',
    page: 1,
    sort: '_id',
  },
  isDocumentUploading: false
};
