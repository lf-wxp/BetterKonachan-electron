import React, { useContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import {
  IoIosCheckmarkCircle,
  IoMdInformationCircleOutline,
  IoIosRefresh
} from 'react-icons/io';
import Progress from '~component/Progress';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Context from '~src/context';

import { EAction, IUpdateProgressPayload } from '~cModel/action';
import { TFuncVoid } from '~util';
import { IDownload } from '~cModel/download';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';

export default React.memo(() => {
  const {
    state: { download },
    dispatch
  } = useContext(Context);

  useEffect((): TFuncVoid => {
    ipcRenderer.on(
      'download-status',
      (
        event: Electron.Event,
        {
          progress,
          index,
          status
        }: { progress: number; index: number; status: 'error' | 'progress' }
      ) => {
        const percent = `${progress * 100}%`;
        dispatch({
          type: EAction.setDownloadStatus,
          payload: {
            index,
            percent,
            status
          } as IUpdateProgressPayload
        });
      }
    );

    return (): void => {
      ipcRenderer.removeAllListeners('download-status');
    };
  }, []);

  const downloadRetry = (url: string, index: number) => {
    ipcRenderer.send('download', { url: url, index });
  };

  return (
    <section className='download'>
      <PerfectScrollbar>
        <div className='downloadBox'>
          {download.map((item: IDownload, key: number) => (
            <div className='downloadItem' key={key}>
              {item.percent === '100%' && (
                <span className='downloadIcon'>
                  <IoIosCheckmarkCircle />
                </span>
              )}
              {item.error && (
                <div className='downloadCatch'>
                  <span className='downloadError'>
                    <IoMdInformationCircleOutline />
                  </span>
                  <span
                    className='downloadRetry'
                    onClick={() => downloadRetry(item.url, key)}
                  >
                    <IoIosRefresh />
                  </span>
                </div>
              )}
              <img src={item.sample} alt='preview' />
              <Progress percent={item.percent} />
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </section>
  );
});
