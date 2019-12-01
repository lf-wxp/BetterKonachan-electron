import React, { useRef, useEffect, useState } from 'react';
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
import { useMeasure } from 'react-use';

import './style.pcss';

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

const parseWidthPersent = ([persent, width]: [string, number]): number =>
  persent2number(persent)(width);

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
    const [ref, { width: parentW, height: parentH }] = useMeasure();

    useEffect(() => {
      bgObj.current = initCb(canvas.current);
    }, []);

    useEffect(() => {
      setRealH(getSize([height, parentH]));
    }, [height, parentH]);

    useEffect(() => {
      setRealW(getSize([width, parentW]));
    }, [width, parentW]);

    useEffect(() => {
      if (bgObj.current) {
        bgObj.current.resize(realW, realH);
      }
    }, [realW, realH]);

    return (
      <div ref={ref} className='bk-canvas'>
        <canvas
          className={className}
          ref={canvas}
          width={realW}
          height={realH}
        />
      </div>
    );
  }
);
