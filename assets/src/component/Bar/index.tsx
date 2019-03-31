import * as React from 'react';
import './style.css';

export default React.memo(() => {

  return (
    <section className="bar">
      <span className="barClose">
      </span>
      <span className="barExpand">
        <span />
      </span>
      <span className="barMini">
      </span>
    </section>
  );
});
