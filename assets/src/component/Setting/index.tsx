import * as React from 'react';
import './style.css';
import Context from '~src/context';

const { useContext } = React;
export default React.memo(() => {
  const { state: { security }, dispatch } = useContext(Context);
  const handleChange = () => {
    dispatch({ type: 'updateState', payload: { security: !security }});
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
