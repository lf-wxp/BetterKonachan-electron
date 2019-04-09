import * as React from 'react';
import { ipcRenderer } from 'electron';
import Context from '~src/context';

import { EAction } from '~cModel/action';
import { IImageList } from '~model/image';

const { useContext, useEffect } = React;

export default React.memo(() => {
  const { dispatch } = useContext(Context);

  useEffect((): () => void => {
    ipcRenderer.on('image-data', (event: Electron.Event, { images, pages, page }: IImageList) => {
      dispatch({
        type: EAction.setItems,
        payload: images,
      });
      dispatch({
        type: EAction.setPages,
        payload: pages,
      });
      dispatch({
        type: EAction.setLoading,
        payload: false,
      });
    });
    ipcRenderer.send('image-post', { page: 1, tags: '' });
    dispatch({
      type: EAction.setPage,
      payload: 1,
    });
    return () => {
      ipcRenderer.removeAllListeners('image-data');
    }
  }, []);

  return null;
});
