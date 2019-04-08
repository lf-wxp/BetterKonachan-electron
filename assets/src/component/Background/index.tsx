import * as React from 'react';
import Context from '~src/context';

import './style.css';

const { useContext }  = React;
export default React.memo(() => {
  const { state: { bgUri } } = useContext(Context);

  return (
    <figure className="bg">
        <img src={bgUri} className="bgImage" />
    </figure>
  );
});
