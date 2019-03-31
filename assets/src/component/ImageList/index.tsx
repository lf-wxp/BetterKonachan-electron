import * as React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import Context from '~src/context';
import { FaDownload } from 'react-icons/fa';
import './style.css';

import { IImageDom } from '~cModel/imageDom';
import { IImage } from '~model/image';

const isValidDom = (dom: HTMLElement | null): dom is HTMLElement => {
  return dom !== null && dom.parentElement !== null;
}

const { useEffect, useState, useContext, useRef } = React;
let columnArray: number[] = [0];
const maxWidth: number = 300;
const minWidth: number = 200;

const calcColumnWidth = (dom: HTMLElement | null): { column: number; width: number } => {
  if (isValidDom(dom)) {
    dom.parentElement
    const w: number = (dom.parentElement as HTMLElement).clientWidth;
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
  } else {
    return {
      column: 0,
      width: 0
    }
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
        transform: `translateX(${x}px) translateY(${y}px)`
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

const updateLayout = (items: IImage[], dom: HTMLElement | null) => {
  const { column, width } = calcColumnWidth(dom);
  columnArray = new Array(column).fill(0);
  const list = calcList(items, width);
  return list;
};

export default React.memo(() => {
  const { state: { items } } = useContext(Context);
  const refDom = useRef(null);
  const [list, setList] = useState(updateLayout(items as IImage[], refDom.current));
  let handler: number;

  const debounceHandler = () => {
    if (handler) {
      clearTimeout(handler);
    }
    handler = window.setTimeout(() => {
      setList(updateLayout(items as IImage[], refDom.current));
    }, 100);
  }

  useEffect((): () => void => {
    window.addEventListener('resize', debounceHandler);
    console.log('dom', refDom.current);
    setList(updateLayout(items as IImage[], refDom.current));
    return () => {
      window.removeEventListener('resize', debounceHandler);
    }
  }, []);

  return (
    <div ref={refDom}>
      <Flipper flipKey={list} className="listWrap" spring="veryGentle">
        {list.map((item: IImageDom, key: number) => (
          <Flipped key={key} flipId={`${key}`} translate>
            <figure style={item.style} className="listItem">
              <img className="listImg" src={item.preview} />
              <div className="listTool">
                <p className="listInfo">{item.width} / {item.height}</p>
                <a href={item.url} download className="listDown" target="_blank">
                  <FaDownload />
                </a>
              </div>
            </figure>
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
});
