import React, { useContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import Context from '~src/context';

import { EAction } from '~cModel/action';
import { ImageList } from '~model/image';
import { EventImage } from '~model/event';

export default React.memo(() => {
  const { dispatch } = useContext(Context);

  useEffect((): (() => void) => {
    ipcRenderer.on(
      EventImage.DATA,
      (event: Electron.Event, { images, pages }: ImageList) => {
        dispatch({
          type: EAction.setItems,
          payload: images
        });
        dispatch({
          type: EAction.setPages,
          payload: pages
        });
        dispatch({
          type: EAction.setLoading,
          payload: false
        });
      }
    );
    ipcRenderer.send(EventImage.POST, { page: 1, tags: '' });
    dispatch({
      type: EAction.setPage,
      payload: 1
    });

    return (): void => {
      ipcRenderer.removeAllListeners(EventImage.DATA);
    };
  }, []);

  return null;
});
