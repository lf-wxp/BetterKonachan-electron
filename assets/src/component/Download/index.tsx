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

import { EAction, UpdateProgressPayload } from '~cModel/action';
import { TFuncVoid } from '~util';
import { Download } from '~cModel/download';
import { EventDownload } from '~model/event';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.pcss';

export default React.memo(() => {
  const {
    state: { download },
    dispatch
  } = useContext(Context);

  useEffect((): TFuncVoid => {
    ipcRenderer.on(
      EventDownload.STATUS,
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
          } as UpdateProgressPayload
        });
      }
    );

    return (): void => {
      ipcRenderer.removeAllListeners(EventDownload.STATUS);
    };
  }, []);

  const downloadRetry = (url: string, index: number): void => {
    ipcRenderer.send(EventDownload.DOWNLOAD, { url: url, index });
  };

  return (
    <section className='bk-download'>
      <PerfectScrollbar>
        <div className='bk-download__box'>
          {download.map((item: Download, key: number) => (
            <div className='bk-download__item' key={key}>
              {item.percent === '100%' && (
                <span className='bk-download__icon'>
                  <IoIosCheckmarkCircle />
                </span>
              )}
              {item.error && (
                <div className='bk-download__catch'>
                  <span className='bk-download__error'>
                    <IoMdInformationCircleOutline />
                  </span>
                  <span
                    className='bk-download__retry'
                    onClick={(): void => downloadRetry(item.url, key)}
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
