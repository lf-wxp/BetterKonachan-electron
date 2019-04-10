import React from 'react';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import Bar from '~component/Bar';
import Page from '~component/Page';
import Setting from '~component/Setting';
import Download from '~component/Download';
import Service from '~component/Service';
import Loading from '~component/Loading';
import { Provider } from '~src/context';
import { ICtx } from '~cModel/ctx';
import bg0 from '~image/bg0.jpg';
import bg1 from '~image/bg1.jpg';
import bg2 from '~image/bg2.jpg';
import bg3 from '~image/bg3.jpg';
import bg4 from '~image/bg4.jpg';
import './css/_var.css';
import './css/_base.css';
import './app.css';

const bgs: string[] = [bg0, bg1, bg2, bg3, bg4];

const defaultBg: string = bgs[Math.floor(Math.random() * 4)];

const App = React.memo(() => {
  const defaultState: ICtx = {
    bgUri: defaultBg,
    pages: 0,
    page: 0,
    items: [],
    download: [],
    security: true,
    expand: true,
    loading: true,
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
          <Loading />
        </div>
      </Provider>
    </React.Fragment>
  )
});

export default App;
