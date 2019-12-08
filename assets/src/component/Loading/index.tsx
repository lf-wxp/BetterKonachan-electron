import React, { useContext } from 'react';
import Context from '~src/context';
import Spinner from 'react-spinkit';

import './style.pcss';

export default React.memo(() => {
  const {
    state: { loading }
  } = useContext(Context);

  if (!loading) {
    return null;
  }

  return (
    <section className='bk-loading'>
      <Spinner name='cube-grid' />
    </section>
  );
});
