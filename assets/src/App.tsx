import * as React from 'react';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import Bar from '~component/Bar';
import Page from '~component/Page';
import Setting from '~component/Setting';
import Download from '~component/Download';
import MockImageData from '~src/mock.json';
import { Provider } from '~src/context';
import { ICtx } from '~cModel/ctx';
import defaultBg from '~image/bg.jpg';
import './css/_var.css';
import './css/_base.css';
import './app.css';

const App = React.memo(() => {
  const state: ICtx = {
    bgUri: defaultBg,
    pages: 15,
    page: 4,
    items: MockImageData,
    download: [],
    security: true,
    expand: true,
  };

  return (
    <React.Fragment>
      <Provider value={state}>
        <div className={`wrapLeft ${state.expand ? 'expand' : ''}`}>
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
