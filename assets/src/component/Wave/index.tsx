import React, { useRef, useEffect, useCallback, useState } from 'react';
import Wave from './Wave';
import { cond, is, nth, pipe, test, isNil, SafePred, allPass, match, __, divide, curry, multiply, not } from 'ramda';

interface WaveProps {
  width?: string | number;
  height: string | number;
}

const judge = (fn: SafePred<unknown> | SafePred<unknown>, idx: number): (x: unknown) => boolean => pipe(nth(idx), fn);

const int = curry(Number.parseInt);

const persent2number = pipe(match(/(\d+)/), nth(0), int(__, 10), divide(__, 100), multiply);

const parseWidthPersent = ([persent, node]: [ string, HTMLElement]): number => persent2number(persent)(node.clientWidth);

const getSize = cond([
  [judge(is(Number), 0), nth(0)],
  [allPass([judge(is(String), 0), judge(test(/^\d+%$/), 0), judge(pipe(isNil, not), 1)]), parseWidthPersent]
]);

export default React.memo<WaveProps>(({ width = '100%', height }) => {
  const canvas = useRef((null as unknown) as HTMLCanvasElement);
  const [realH, setRealH] = useState(0);
  const [realW, setRealW] = useState(0);
  const wave = useRef(null as unknown as Wave);
  const parent = useCallback(() => canvas?.current?.parentElement, [canvas]);

  useEffect(() => {
    wave.current = new Wave((canvas.current as unknown) as HTMLCanvasElement, 3, 3);
  }, []);

  useEffect(() => {
    setRealH(getSize([height, parent()]));
  }, [height, parent]);

  useEffect(() => {
    setRealW(getSize([width, parent()]));
  }, [width, parent]);

  useEffect(() => {
    if (wave.current) {
      wave.current.resize(realW, realH);
    }
  }, [realW, realH]);

  return <canvas ref={canvas} width={realW} height={realH} />
});
