import * as React from 'react';
import { MdRemove, MdCropSquare, MdClose } from 'react-icons/md';
import './style.css';

export default React.memo(() => {

  return (
    <section className="bar">
      <div className="barDrag">
        BetterKonachan
      </div>
      <span className="barIcon">
        <MdRemove />
      </span>
      <span className="barIcon">
        <MdCropSquare />
      </span>
      <span className="barIcon">
        <MdClose />
      </span>
    </section>
  );
});
