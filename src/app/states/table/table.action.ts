import { TableFetchOptions } from './table.model';

export class TableFetchAction {
  static readonly type = '[TABLE] FetchAction';
  constructor() {}
}

export class SetTableFetchOption {
  static readonly type = '[TABLE] SetTableFetchOption';
  constructor(public payload: TableFetchOptions) {}
}

export class SubMaterialSubmitAction {
  static readonly type = '[TABLE] SubMaterialSubmitAction';
  constructor(public payload: any) {}
}

export class SubMaterialDocumentUploadAction {
  static readonly type = '[Form] SubMaterialDocumentUploadAction';
  constructor(public payload: any, public isMasterMaterial: any) {}
}

export class SetActiveTableNameAction {
  static readonly type = '[TABLE] SetActiveTableNameAction';
  constructor(public payload: any) {}
}

export class DeleteMaterialDataAction {
  static readonly type = '[TABLE] DeleteMaterialDataAction';
  constructor(public payload: any) {}
}

export class DeleteSubMaterialDataAction {
  static readonly type = '[TABLE] DeleteSubMaterialDataAction';
  constructor(public payload: any) {}
}

export class clearAllQtyAction {
  static readonly type = '[TABLE] clearAllQtyAction';
  constructor() {}
}

export class reorderAction {
  static readonly type = '[TABLE] reorderAction';
  constructor(public payload: any) {}
}
