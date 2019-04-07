

// interface IPayload<T> extends IUpdateProgressPayload { 
// }
export interface IUpdateProgressPayload {
  index: number;
  percent: string;
}
export interface IAction<T> {
  type: string;
  // payload: TPayload<T,IUpdateProgressPayload>;
  payload: Partial<T>;
}
