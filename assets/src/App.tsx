import * as React from 'react';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import MockImageData from '~src/mock.json';
import { Provider } from '~src/context';
import { ICtx } from '~cModel/ctx';
import defaultBg from '~image/bg.jpg';
import './css/_var.css';
import './css/_base.css';
import './css/_icon.css';
import './app.css';

const App = React.memo(() => {
  const state: ICtx = {
    bgUri: defaultBg,
    pages: 0,
    items: MockImageData,
  }

  return (
    <div className="wrap">
      <Provider value={state}>
        <Background />
        <ImageList />
      </Provider>
    </div>
  )
});

export default App;
