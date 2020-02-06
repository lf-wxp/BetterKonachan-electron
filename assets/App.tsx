import React from 'react';
import ImageList from '~component/ImageList';
import Background from '~component/Background';
import Bar from '~component/Bar';
import Page from '~component/Page';
import Setting from '~component/Setting';
import Download from '~component/Download';
import Service from '~component/Service';
import Loading from '~component/Loading';
import DotLine from '~component/DotLine';
import Selector from '~component/Selector';
import Search from '~component/Search';
import { Provider } from '~assets/context';

import { Ctx } from '~cModel/ctx';

import './css/_var.pcss';
import './css/_base.pcss';
import './app.pcss';

const App: React.MemoExoticComponent<() => React.ReactElement> = React.memo(
  () => {
    const defaultState: Ctx = {
      pages: 0,
      page: 0,
      items: [],
      download: [],
      colorSet: {
        vibrant: '#39cccc',
        muted: '#0984e3'
      },
      security: true,
      loading: true,
      tags: ''
    };

    return (
      <React.Fragment>
        <Provider value={defaultState}>
          <Background />
          <DotLine />
          <aside className='bk-aside'>
            <Bar />
            <Page />
            <Setting />
            <Search />
            <Download />
            <Selector />
          </aside>
          <section className='bk-section'>
            <Service />
            <ImageList />
          </section>
          <Loading />
        </Provider>
      </React.Fragment>
    );
  }
);

export default App;
