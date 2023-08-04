export class FetchFagAction {
  static readonly type = '[Fag] FetchFagAction';
  constructor() { }
}

export class FagInsertAction {
  static readonly type = '[Fag] FagInsertAction';
  constructor(public payload: any) { }
}

export class FagUpdateAction {
  static readonly type = '[Fag] FagUpdateAction';
  constructor(public payload: any) { }
}

export class FagDeleteAction {
  static readonly type = '[Fag] FagDeleteAction';
  constructor(public payload: any) { }
}

export class CheckfagUsageAction {
  static readonly type = '[Fag] CheckfagUsedAction';
  constructor(public payload: any) { }
}

export class ReplaceFagAction {
  static readonly type = '[Fag] ReplaceFagAction';
  constructor(public payload: any) { }
}