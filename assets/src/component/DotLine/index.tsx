import React, { useCallback } from 'react';
import Canvas from '../Canvas';
import DotLine from './DotLine';

import './style.pcss';

interface DotLineProps {
  width?: string | number;
  height?: string | number;
}

export default React.memo<DotLineProps>(
  ({ width = '100%', height = '100%' }) => {
    const wave = useCallback(canvas => new DotLine(canvas, 10), []);
    return (
      <Canvas
        className='bk-dotline'
        width={width}
        height={height}
        initCb={wave}
      />
    );
  }
);
