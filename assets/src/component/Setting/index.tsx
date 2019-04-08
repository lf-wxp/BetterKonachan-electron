import * as React from 'react';
import Context from '~src/context';

import { EAction } from '~cModel/action';

import './style.css';

const { useContext } = React;
export default React.memo(() => {
  const { state: { security }, dispatch } = useContext(Context);
  const handleChange = () => {
    dispatch({ type: EAction.setSecurity, payload: !security });
  }

  return (
    <section className={`setting ${security ? 'active': ''}`}>
      <label className="sToggle">
        <input type="checkbox" className="sSecurity" onChange={handleChange}/>
        <span className="sFake"/>
      </label>
    </section>
  );
});
