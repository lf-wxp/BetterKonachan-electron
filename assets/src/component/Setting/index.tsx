import React, { useContext } from 'react';
import { ipcRenderer } from 'electron';
import Context from '~src/context';

import { EAction } from '~cModel/action';

import './style.pcss';

import { TFuncVoid } from '~util';

export default React.memo(() => {
  const {
    state: { security, loading, page },
    dispatch
  } = useContext(Context);
  const handleSecurityClick: TFuncVoid = (): void => {
    dispatch({
      type: EAction.setSecurity,
      payload: !security
    });
  };

  const handleRefreshClick: TFuncVoid = (): void => {
    ipcRenderer.send('image-post', { page, tags: '' });
    dispatch({
      type: EAction.setLoading,
      payload: true
    });
  };

  return (
    <section className='setting'>
      <article className={`sSecurity ${security ? 'active' : ''}`}>
        <label className='sToggle' onClick={handleSecurityClick}>
          <span className='sFake' />
        </label>
      </article>
      <article
        className={`sRefresh ${loading ? 'active' : ''}`}
        onClick={handleRefreshClick}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </article>
    </section>
  );
});
