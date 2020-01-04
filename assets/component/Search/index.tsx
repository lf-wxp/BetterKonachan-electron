import React, { useCallback, useContext, useState } from 'react';
import Context from '~assets/context';
import { EAction } from '~cModel/action';
import { ipcRenderer } from 'electron';
import { EventImage } from '~model/event';

import './style.pcss';

export default React.memo(() => {
  const {
    dispatch,
    state: { tags }
  } = useContext(Context);
  const [value, setValue] = useState('');
  const onKeyPress = useCallback(
    (e): void => {
      if (e.key === 'Enter' && value !== tags) {
        ipcRenderer.send(EventImage.POST, { page: 1, tags: value });
        dispatch({
          type: EAction.setTags,
          payload: value
        });
        dispatch({
          type: EAction.setLoading,
          payload: true
        });
      }
    },
    [dispatch, value, tags]
  );
  const onInput = useCallback((e): void => {
    setValue(e.target.value);
  }, []);
  return (
    <input
      className='bk-search'
      value={value}
      onInput={onInput}
      onKeyPress={onKeyPress}
    />
  );
});
