import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import Bar from '~component/Bar';
import MockImageData from '~src/mock.json';
import { Provider } from '~src/context';
import { ICtx } from '~cModel/ctx';
import defaultBg from '~image/bg.jpg';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './css/_var.css';
import './css/_base.css';
import './app.css';

const App = React.memo(() => {
  const state: ICtx = {
    bgUri: defaultBg,
    pages: 0,
    items: MockImageData,
  }

  return (
    <React.Fragment>
      <Bar />
      <div className="wrap">
        <Provider value={state}>
          <Background />
          <PerfectScrollbar>
            <ImageList />
          </PerfectScrollbar>
        </Provider>
      </div>
    </React.Fragment>
  )
});

export default App;
