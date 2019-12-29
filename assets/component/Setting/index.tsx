import React, { useContext } from 'react';
import { ipcRenderer } from 'electron';
import Context from '~assets/context';

import { EAction } from '~cModel/action';
import { EventImage } from '~model/event';
import { TFuncVoid } from '~util';

import './style.pcss';

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
    ipcRenderer.send(EventImage.POST, { page, tags: '' });
    dispatch({
      type: EAction.setLoading,
      payload: true
    });
  };

  return (
    <section className='bk-setting'>
      <article className={`bk-setting__security ${security ? 'active' : ''}`}>
        <label className='bk-setting__toggle' onClick={handleSecurityClick}>
          <span className='bk-setting__fake' />
        </label>
      </article>
      <article
        className={`bk-setting__refresh ${loading ? 'active' : ''}`}
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
