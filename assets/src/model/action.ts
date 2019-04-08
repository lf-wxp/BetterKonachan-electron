import { ICtx } from './ctx';

export enum EAction {
  setBgUri = 'setBgUri',
  setItems = 'setItems',
  setPage = 'setPage',
  setPages = 'setPages',
  setSecurity = 'setSecurity',
  setExpand = 'setExpand',
  setDownload = 'setDownload',
  setProgress = 'setProgress',
}

export interface IUpdateProgressPayload {
  index: number;
  percent: string;
}
export interface IAction {
  type: EAction;
  payload: ICtx[keyof ICtx] | IUpdateProgressPayload;
}
