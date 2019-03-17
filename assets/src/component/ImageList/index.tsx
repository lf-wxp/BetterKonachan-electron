import * as React from 'react';
import StackGrid, { transitions } from 'react-stack-grid';
import './style.css';

// import { IImageDom } from '~cModel/imageDom';

console.log('StackGrid', StackGrid);
interface IImageDom {
  width: number;
  height: number;
  url: string;
}

const { scaleDown } = transitions;

export default ({ items }: { items: IImageDom[] }) => {

  return (
    <div>
    <StackGrid
      appear={scaleDown.appear}
      appeared={scaleDown.appeared}
      enter={scaleDown.enter}
      entered={scaleDown.entered}
      leaved={scaleDown.leaved}
      columnWidth={150}>
      {items.map((item, key) => (
        <figure key={key}>
          <img className="lImg" />
            <div className="lTool">
              <p className="lInfo">{item.width} / {item.height}</p>
              <a href={item.url} download className="lDown" target="_blank">
                <i className="icon-download" />
                {item.url}
              </a>
            </div>
        </figure >
      ))}
    </StackGrid>
    </div>
  );
}
