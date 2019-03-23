import * as React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import Context from '~src/context';
import './style.css';

import { IImageDom } from '~cModel/imageDom';
import { IImage } from '~model/image';

const { useEffect, useState, useContext } = React;
let columnArray: number[] = [0];
const maxWidth: number = 300;
const minWidth: number = 200;

const calcColumnWidth = (): { column: number; width: number } => {
  const w: number = document.body.clientWidth;
  const l: number = w % maxWidth;
  let column: number;
  let width: number;
  if (l) {
    column = Math.ceil(w / maxWidth);
    width = w / column;
  } else {
    column = w / maxWidth;
    width = maxWidth;
  }
  if (width < minWidth) {
    column = 1;
    width = w;
  }

  return {
    column,
    width,
  }
}
const calcColumnArray = (h: number): void => {
  const { index, height } = shortestColumn();
  columnArray.splice(index, 1, height + h);
};

const calcPosition = (w: number): { x: number; y: number } => {
  const { height, index } = shortestColumn();
  const offsetX: number = index * w;
  const offsetY: number = height;

  return {
      x: offsetX,
      y: offsetY
  };
}

const calcList = (items: IImage[], width: number): IImageDom[] => {
  const list = items.map((item: IImage, i: number) => {
    const newItem: IImageDom = { ...item };
    const h: number = item.height / item.width * width;
    newItem.styleW = width;
    newItem.styleH = h;
    const { x, y } = calcPosition(width);
    calcColumnArray(h);
    newItem.style = {
        width: `${width}px`,
        height: `${h}px`,
        transform: `translate(${x}px, ${y}px)`
    };

    return newItem;
  });

  return list;
}
const shortestColumn = (): { height: number; index: number} => {
  const min = Math.min(...columnArray);
  const index = columnArray.indexOf(min);

  return {
    height: min,
    index,
  }
};

const updateLayout = (items: IImage[]) => {
  const { column, width } = calcColumnWidth();
  columnArray = new Array(column).fill(0);
  const list = calcList(items, width);
  return list;
};

export default React.memo(() => {
  const { state: { items } } = useContext(Context);
  const [list, setList] = useState(updateLayout(items as IImage[]));
  let handler: number;

  const debounceHandler = () => {
    if (handler) {
      clearTimeout(handler);
    }
    handler = window.setTimeout(() => {
      setList(updateLayout(items as IImage[]));
    }, 500);
  }

  useEffect((): () => void => {
    window.addEventListener('resize', debounceHandler);
    return () => {
      window.removeEventListener('resize', debounceHandler);
    }
  }, [list]);

  return (
    <Flipper flipKey={list} className="listWrap">
      {list.map((item: IImageDom, key: number) => (
        <Flipped key={key}>
          <figure style={item.style} className="listItem">
            <img className="listImg" src={item.url}/>
            <div className="listTool">
              <p className="listInfo">{item.width} / {item.height}</p>
              <a href={item.url} download className="listDown" target="_blank">
                <i className="icon-download" />
              </a>
            </div>
          </figure >
        </Flipped>
      ))}
    </Flipper>
  );
});
