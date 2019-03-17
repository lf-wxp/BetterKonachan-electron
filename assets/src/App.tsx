import * as React from 'react';
import ImageList from '~component/ImageList';
import './css/_var.css';
import './css/_base.css';
import './css/_icon.css';

const items = new Array(17).fill(4).map(item => ({
  width: 100,
  height: 100,
  url: '123',
}));

const App = () => {

  return (
    <div className="wrap">
      <ImageList items={items} />
    </div>
  )
}

export default App;
