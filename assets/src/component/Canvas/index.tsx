import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  cond,
  is,
  nth,
  pipe,
  test,
  isNil,
  SafePred,
  allPass,
  match,
  __,
  divide,
  curry,
  multiply,
  not
} from 'ramda';

interface CanvasProps {
  width?: string | number;
  height: string | number;
  className: string;
  initCb(canvas: HTMLCanvasElement): any;
}

const judge = (
  fn: SafePred<unknown> | SafePred<unknown>,
  idx: number
): ((x: unknown) => boolean) => pipe(nth(idx), fn);

const int = curry(Number.parseInt);

const persent2number = pipe(
  match(/(\d+)/),
  nth(0),
  int(__, 10),
  divide(__, 100),
  multiply
);

const parseWidthPersent = ([persent, node]: [string, HTMLElement]): number =>
  persent2number(persent)(node.clientWidth);

const getSize = cond([
  [judge(is(Number), 0), nth(0)],
  [
    allPass([
      judge(is(String), 0),
      judge(test(/^\d+%$/), 0),
      judge(pipe(isNil, not), 1)
    ]),
    parseWidthPersent
  ]
]);

export default React.memo<CanvasProps>(
  ({ width = '100%', height, className, initCb }) => {
    const canvas = useRef((null as unknown) as HTMLCanvasElement);
    const [realH, setRealH] = useState(0);
    const [realW, setRealW] = useState(0);
    const bgObj = useRef(null as any);
    const parent = useCallback(() => canvas?.current?.parentElement, [canvas]);

    useEffect(() => {
      bgObj.current = initCb(canvas.current);
    }, []);

    useEffect(() => {
      setRealH(getSize([height, parent()]));
    }, [height, parent]);

    useEffect(() => {
      setRealW(getSize([width, parent()]));
    }, [width, parent]);

    useEffect(() => {
      if (bgObj.current) {
        bgObj.current.resize(realW, realH);
      }
    }, [realW, realH]);

    return (
      <canvas className={className} ref={canvas} width={realW} height={realH} />
    );
  }
);
