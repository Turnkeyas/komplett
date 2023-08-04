export class FetchMaterialGroupsAction {
  static readonly type = '[Material-Groups] FetchMaterialGroupsAction';
  constructor(public payload: any) {}
}

export class AddMaterialGroupAction {
  static readonly type = '[Material-Groups] AddMaterialGroupAction';
  constructor(public payload: any) {}
}

export class UpdateMaterialGroupAction {
  static readonly type = '[Material-Groups] UpdateMaterialGroupAction';
  constructor(public payload: any) {}
}

export class DeleteMaterialGroupAction {
  static readonly type = '[Material-Groups] DeleteMaterialGroupAction';
  constructor(public payload: any) {}
}

export class AddMaterialSubgroupAction {
  static readonly type = '[Material-Groups] AddMaterialSubgroupAction';
  constructor(public payload: any) {}
}

export class UpdateMaterialSubgroupAction {
  static readonly type = '[Material-Groups] UpdateMaterialSubgroupAction';
  constructor(public payload: any) {}
}

export class DeleteMaterialSubgroupAction {
  static readonly type = '[Material-Groups] DeleteMaterialSubgroupAction';
  constructor(public payload: any) {}
}
