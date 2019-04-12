import React, { useContext } from 'react';
import Context from '~src/context';

import { EAction } from '~cModel/action';

import './style.css';

import { TFuncVoid } from '~util';

export default React.memo(() => {
  const { state: { security }, dispatch } = useContext(Context);
  const handleChange: TFuncVoid = (): void => {
    dispatch({ type: EAction.setSecurity, payload: !security });
  };

  return (
    <section className={`setting ${security ? 'active' : ''}`}>
      <label className='sToggle'>
        <span className='sSecurity' onChange={handleChange} />
        <span className='sFake'/>
      </label>
    </section>
  );
});
