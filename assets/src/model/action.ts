import { ICtx } from './ctx';

export enum EAction {
  setBgUri = 'setBgUri',
  setItems = 'setItems',
  setPage = 'setPage',
  setPages = 'setPages',
  setSecurity = 'setSecurity',
  setExpand = 'setExpand',
  setDownload = 'setDownload',
  setLoading = 'setLoading',
  setDownloadStatus = 'setDownloadStatus'
}

export interface IUpdateProgressPayload {
  index: number;
  percent: string;
  status: 'error' | 'progress';
}
export interface IAction {
  // tslint:disable-next-line: no-reserved-keywords
  type: EAction;
  payload: ICtx[keyof ICtx] | IUpdateProgressPayload;
}

export type TReducer = (state: ICtx, action: IAction) => ICtx;

export interface IContext {
  state: ICtx;
  dispatch: React.Dispatch<IAction>;
}
