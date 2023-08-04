export class FetchOfferTemplateAction {
  static readonly type = '[Shared] FetchOfferTemplateAction';
  constructor() { }
}

export class UpdateOfferTemplateAction {
  static readonly type = '[Shared] UpdateOfferTemplateAction';
  constructor(public payload: any) { }
}

export class AddSubMaterialDetailAction {
  static readonly type = '[Shared] AddSubMaterialDetailAction';
  constructor(public payload: any) { }
}

export class DeleteFDVDocumentAction {
  static readonly type = '[Shared] DeleteFDVDocumentAction';
  constructor(public payload: any, public isMasterMaterial: any) { }
}