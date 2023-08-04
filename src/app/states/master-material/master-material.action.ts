export class SubMaterialListFetchAction {
  static readonly type = '[MASTER-MATERIAL] SubMaterialListFetchAction';
  constructor(public payload: any) { }
}

export class MasterMaterialFetchAction {
  static readonly type = '[MASTER-MATERIAL] MasterMaterialFetchAction';
  constructor() { }
}

export class SetMasterMaterialFetchOption {
  static readonly type = '[MASTER-MATERIAL] SetMasterMaterialFetchOption';
  constructor(public payload: any) { }
}

export class AddMaterialDataAction {
  static readonly type = '[MATERIAL] AddMaterialDataAction';
  constructor(public payload: any) { }
}

export class EditMaterialDataAction {
  static readonly type = '[MATERIAL] EditMaterialDataAction';
  constructor(public payload: any) { }
}

export class AddSubMaterialsAction {
  static readonly type = '[MATERIAL] AddSubMaterialsAction';
  constructor(public payload: any) { }
}

export class AddMasterMaterialDataAction {
  static readonly type = '[MATERIAL] AddMasterMaterialDataAction';
  constructor(public payload: any) { }
}

export class EditMasterMaterialDataAction {
  static readonly type = '[MATERIAL] EditMasterMaterialDataAction';
  constructor(public payload: any) { }
}

export class DeleteMasterMaterialDataAction {
  static readonly type = '[MATERIAL] DeleteMasterMaterialDataAction';
  constructor(public payload: any) { }
}

/** Fag */
export class FetchFagDataAction {
  static readonly type = '[MATERIAL] FetchFagDataAction';
  constructor() { }
}
