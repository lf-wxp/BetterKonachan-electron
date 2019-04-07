import * as React from 'react';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import Bar from '~component/Bar';
import Page from '~component/Page';
import Setting from '~component/Setting';
import Download from '~component/Download';
import Service from '~component/Service';
import MockImageData from '~src/mock.json';
import { Provider } from '~src/context';
import { ICtx } from '~cModel/ctx';
import defaultBg from '~image/bg.jpg';
import './css/_var.css';
import './css/_base.css';
import './app.css';

const App = React.memo(() => {
  const defaultState: ICtx = {
    bgUri: defaultBg,
    pages: 0,
    page: 0,
    items: MockImageData,
    download: [],
    security: true,
    expand: true,
  };

  return (
    <React.Fragment>
      <Provider value={defaultState}>
        <Service />
        <div className={`wrapLeft ${defaultState.expand ? 'expand' : ''}`}>
          <Bar />
          <Page />
          <Setting />
          <Download />
        </div>
        <div className="wrapRight">
          <Background />
          <ImageList />
        </div>
      </Provider>
    </React.Fragment>
  )
});

export default App;
