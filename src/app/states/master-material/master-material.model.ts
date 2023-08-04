export interface MasterMaterialFetchOptions {
  sort: String;
  limit: Number | 10;
  page: Number | 1;
  order: 'acs' | 'desc';
  category: String;
  groupId: String;
}

export interface MasterMaterialStateModel {
  materialData: any;
  subMaterialList: any;
  masterMaterialOptions: MasterMaterialFetchOptions;
  isLoading: true | false;
  fagList: Array<any>;
}

export const DefaultMasterMaterialStateModel: MasterMaterialStateModel = {
  materialData: null,
  masterMaterialOptions: {
    category: 'Carpentry',
    limit: 10,
    order: 'acs',
    page: 1,
    sort: '_id',
    groupId: ''
  },
  subMaterialList: [],
  isLoading: false,
  fagList: []
};
