export interface IAction<T> {
  type: string;
  payload: Partial<T>;
}
