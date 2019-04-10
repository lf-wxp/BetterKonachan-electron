import React from 'react';
import { ipcRenderer } from 'electron';

import './style.css';

export default React.memo(() => {
  const close = (): void => {
    ipcRenderer.send('window-close');
  }
  const max = (): void => {
    ipcRenderer.send('window-max');
  }
  const min = (): void => {
    ipcRenderer.send('window-min');
  }
  return (
    <section className="bar">
      <span className="barClose" onClick={close}/>
      <span className="barExpand" onClick={max}>
        <span />
      </span>
      <span className="barMini" onClick={min} />
    </section>
  );
});
