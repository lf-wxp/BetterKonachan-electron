import React from 'react';

import './style.pcss';

export default React.memo(({ percent }: { percent: string }) => {
  return (
    <span className='bk-progress'>
      <span style={{ width: percent }} />
    </span>
  );
});
