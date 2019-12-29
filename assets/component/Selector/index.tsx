import React, { useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { EventAction } from '~model/event';

import './style.pcss';

export default React.memo(() => {
  const onClick = useCallback((): void => {
    ipcRenderer.send(EventAction.SET_BACKGROUND_DIR);
  }, []);
  return (
    <button className='bk-selector' onClick={onClick}>
      select
    </button>
  );
});
