import {
  allPass,
  cond,
  curry,
  divide,
  is,
  isNil,
  match,
  multiply,
  not,
  nth,
  pipe,
  SafePred,
  test,
  __
} from 'ramda';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useMeasure } from 'react-use';
import Context from '~src/context';
import DotLine from './DotLine';

import './style.pcss';

interface DotLineProps {
  width?: string | number;
  height?: string | number;
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

export default React.memo<DotLineProps>(
  ({ width = '100%', height = '100%' }) => {
    const canvas = useRef((null as unknown) as HTMLCanvasElement);
    const [realH, setRealH] = useState(0);
    const [realW, setRealW] = useState(0);
    const bgObj = useRef((null as unknown) as DotLine);
    const [ref, { width: parentW, height: parentH }] = useMeasure();
    const {
      state: {
        colorSet: { vibrant, muted }
      }
    } = useContext(Context);

    useEffect(() => {
      bgObj.current = new DotLine(canvas.current, 5);
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

    useEffect(() => {
      if (bgObj.current) {
        bgObj.current.setColor({ dotColor: vibrant, lineColor: muted });
      }
    }, [vibrant, muted]);

    return (
      <div ref={ref} className='bk-canvas'>
        <canvas
          className='bk-dotline'
          ref={canvas}
          width={realW}
          height={realH}
        />
      </div>
    );
  }
);
