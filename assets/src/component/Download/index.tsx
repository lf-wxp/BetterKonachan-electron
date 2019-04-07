import * as React from 'react';
import { ipcRenderer } from 'electron';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Context from '~src/context';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Progress from '~component/Progress';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';

const { useContext, useEffect } = React;
export default React.memo(() => {
  const { state: { download }, dispatch } = useContext(Context);

  useEffect((): () => void => {
    ipcRenderer.on('progress', (event: Electron.Event, { progress, index }: { progress: number; index: number } ) => {
      const percent = `${progress * 100}%`;
      dispatch({
        type: 'updateProgress',
        payload: {
          index,
          percent,
        },
      });
    });
    return () => {
      ipcRenderer.removeAllListeners('progress');
    };
  }, []);
  return (
    <section className="download">
      <PerfectScrollbar>
        <div className="downloadBox">
          {download.map((item, key) => (
            <div className="downloadItem" key={key}>
              { item.percent === '100%' && (
                <span className="downloadIcon">
                  <IoIosCheckmarkCircle />
                </span>
              )}
              <img src={item.url} alt=""/>
              <Progress percent={item.percent} />
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </section>
  );
});
