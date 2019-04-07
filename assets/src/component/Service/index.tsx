import * as React from 'react';
import Context from '~src/context';
import { ipcRenderer } from 'electron';
import { IImageList } from '~model/image';

const { useContext, useEffect } = React;

export default React.memo(() => {
  const { dispatch } = useContext(Context);

  ipcRenderer.on('image-data', (event: Electron.Event, { images, pages, page }: IImageList) => {
    dispatch({
      type: 'updateState',
      payload: {
        items: images,
        pages,
      },
    });
  });

  useEffect((): void => {
    ipcRenderer.send('image-post', { page: 1, tags: '' });
    dispatch({
      type: 'updateState',
      payload: {
        page: 1,
      },
    });
  }, []);

  return null;
});
