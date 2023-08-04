import { SUBMATERIAL_DATA } from 'src/app/core/constants/constants';

export interface SharedStateModel {
  offerTemplate: Array<any>;
  isLoading: boolean;
  subMaterialDetail: any;
}

export const DefaultSharedStateModel: SharedStateModel = {
  offerTemplate: [],
  isLoading: false,
  subMaterialDetail: SUBMATERIAL_DATA,
};
