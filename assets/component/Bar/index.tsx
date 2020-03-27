import React from 'react';
import { ipcRenderer } from 'electron';
import { EventWindow } from '~model/event';
import { TFuncVoid } from '~util';

import './style.pcss';

export default React.memo(() => {
  const close: TFuncVoid = (): void => {
    ipcRenderer.send(EventWindow.CLOSE);
  };
  const max: TFuncVoid = (): void => {
    ipcRenderer.send(EventWindow.MAX);
  };
  const min: TFuncVoid = (): void => {
    ipcRenderer.send(EventWindow.MIN);
  };

  return (
    <section className='bk-bar'>
      <span className='bk-bar__close' onClick={close} role='button' />
      <span className='bk-bar__expand' onClick={max} role='button'>
        <span />
      </span>
      <span className='bk-bar__mini' onClick={min} role='button' />
    </section>
  );
});
