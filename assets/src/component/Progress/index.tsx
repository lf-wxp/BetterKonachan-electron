import React from 'react';

import './style.pcss';

export default React.memo(
  ({ percent, error = false }: { percent: string; error?: boolean }) => {
    return (
      <span className={`bk-progress ${error ? 'bk-progress--error' : ''}`}>
        <span style={{ width: percent }} />
      </span>
    );
  }
);
