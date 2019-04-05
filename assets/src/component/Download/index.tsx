import * as React from 'react';
import Context from '~src/context';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Progress from '~component/Progress';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';

const { useContext } = React;
export default React.memo(() => {
  const { state: { download } } = useContext(Context);

  return (
    <section className="download">
      <PerfectScrollbar>
        <div className="downloadBox">
          {download.map((item, key) => (
            <div className="downloadItem" key={key}>
              <img src={item.url} alt=""/>
              <Progress percent={item.percent} />
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </section>
  );
});
