import React, { useCallback } from 'react';
import Canvas from '../Canvas';
import Wave from './Wave';
import './style.pcss';

interface WaveProps {
  width?: string | number;
  height: string | number;
}

export default React.memo<WaveProps>(({ width = '100%', height }) => {
  const wave = useCallback(
    canvas => new Wave(canvas, 3, 6, ['#ff008a', '#00ffc6', '#fcff00']),
    []
  );
  return (
    <Canvas className='bk-wave' width={width} height={height} initCb={wave} />
  );
});
