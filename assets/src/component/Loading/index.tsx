import * as React from 'react';
import Context from '~src/context';
import Spinner from 'react-spinkit';

import './style.css';

const { useContext } = React;

export default React.memo(() => {
  const { state: { loading } } = useContext(Context);

  if (!loading) return null;

  return (
    <section className="loading">
      <Spinner name="cube-grid" />
    </section>
  );
});
