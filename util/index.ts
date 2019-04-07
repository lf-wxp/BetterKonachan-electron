export type TFunc1Void<T> = (x: T) => void;
export type TFunc1<T, P> = (x: T) => P;
export type TFuncVoid<T = void> = () => T;

export function isValidType<T>(win: T | null): win is T {
  return win !== null;
}
