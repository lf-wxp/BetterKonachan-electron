import React from 'react';
import { ipcRenderer } from 'electron';

import { TFuncVoid } from '~util';

import './style.css';

export default React.memo(() => {
  const close: TFuncVoid = (): void => {
    ipcRenderer.send('window-close');
  };
  const max: TFuncVoid = (): void => {
    ipcRenderer.send('window-max');
  };
  const min: TFuncVoid = (): void => {
    ipcRenderer.send('window-min');
  };

  return (
    <section className='bar'>
      <span className='barClose' onClick={close} role='button' />
      <span className='barExpand' onClick={max} role='button'>
        <span />
      </span>
      <span className='barMini' onClick={min} role='button' />
    </section>
  );
});
