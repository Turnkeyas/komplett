export interface FagModel {
  fags: Array<any>,
  isLoading: boolean,
  isFagUsed: boolean
}

export const DefaultFags: FagModel = {
  fags: [],
  isLoading: false,
  isFagUsed: false
}
