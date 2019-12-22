import { ipcRenderer } from 'electron';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useMeasure } from 'react-use';
import Image from '~component/Image';
import useImageLoad from '~hook/useImageLoad';
import fallbackImage from '~image/loaderror.png';
import Context from '~src/context';

import { TFunc1, TFunc1Void, TFunc2, TFunc3, TFuncVoidReturn } from '~util';
import { EventDownload } from '~model/event';
import { ImageDetail } from '~model/image';
import { EAction } from '~cModel/action';
import { Download } from '~cModel/download';
import { ImageDom } from '~cModel/imageDom';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.pcss';

let columnArray: number[] = [0];
const maxWidth = 300;
const minWidth = 200;

const shortestColumn: TFuncVoidReturn<{ height: number; index: number }> = (): {
  height: number;
  index: number;
} => {
  const min: number = Math.min(...columnArray);
  const index: number = columnArray.indexOf(min);

  return {
    height: min,
    index
  };
};

const calcColumnWidth: TFunc1<number, { column: number; colWidth: number }> = (
  width: number
): { column: number; colWidth: number } => {
  let column = 0;
  let colWidth = 0;
  if (width) {
    const w: number = width;
    const l: number = w % maxWidth;
    if (l) {
      column = Math.ceil(w / maxWidth);
      colWidth = w / column;
    } else {
      column = w / maxWidth;
      colWidth = maxWidth;
    }
    if (colWidth < minWidth) {
      column = 1;
      colWidth = w;
    }
  }
  return {
    column,
    colWidth
  };
};

const calcColumnArray: TFunc1Void<number> = (h: number): void => {
  const { index, height } = shortestColumn();
  columnArray.splice(index, 1, height + h);
};

const calcPosition: TFunc1<number, { x: number; y: number }> = (
  w: number
): { x: number; y: number } => {
  const { height, index } = shortestColumn();
  const offsetX: number = index * w;
  const offsetY: number = height;

  return {
    x: offsetX,
    y: offsetY
  };
};

const calcList: TFunc2<ImageDetail[], number, ImageDom[]> = (
  items: ImageDetail[],
  width: number
): ImageDom[] => {
  return items.map((item: ImageDetail) => {
    const newItem: ImageDom = { ...item };
    const h: number = (item.height / item.width) * width;
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
};

const updateLayout: TFunc3<ImageDetail[], number, boolean, ImageDom[]> = (
  items: ImageDetail[],
  width: number,
  security: boolean
): ImageDom[] => {
  const { column, colWidth } = calcColumnWidth(width);
  // tslint:disable-next-line: prefer-array-literal
  columnArray = new Array(column).fill(0);
  const filterItem: ImageDetail[] = items.filter((item: ImageDetail) =>
    security ? item.security : true
  );

  return calcList(filterItem, colWidth);
};

export default React.memo(() => {
  const {
    state: { items, download, security },
    dispatch
  } = useContext(Context);
  const [list, setList] = useState([] as ImageDom[]);
  const [refDom, { width }] = useMeasure();
  const images = useImageLoad<ImageDetail>(items, 'preview');

  const handleDownload: TFunc1Void<React.FormEvent<HTMLAnchorElement>> = (
    e: React.FormEvent<HTMLAnchorElement>
  ): void => {
    e.preventDefault();
    const target: HTMLElement = e.currentTarget;
    const { id } = target.dataset;
    const item = items.find((it: ImageDetail) => `${it.id}` === id);
    if (!item) {
      return;
    }
    const data: Download = {
      url: item.url,
      sample: item.preview,
      percent: '0%',
      status: 'init'
    };
    if (!download.find(({ url }: { url: string }) => url === data.url)) {
      dispatch({
        type: EAction.setDownload,
        payload: [...download, data]
      });
      ipcRenderer.send(EventDownload.DOWNLOAD, {
        url: item.url
      });
    }
  };

  useEffect((): void => {
    setList(updateLayout(images, width, security));
  }, [width, images, security]);

  const combineStyle: TFunc2<CSSProperties, number, CSSProperties> = (
    style: CSSProperties,
    key: number
  ): CSSProperties => {
    return {
      ...style,
      transitionDelay: `${key * 0.05}s`
    };
  };

  return (
    <PerfectScrollbar>
      <div ref={refDom} className='bk-list__wrap'>
        <TransitionGroup>
          {list.map((item: ImageDom, key: number) => (
            <CSSTransition key={item.name} timeout={5000} classNames='flip'>
              <figure
                key={item.name}
                style={combineStyle(item.style as CSSProperties, key)}
                className='bk-list__item'
              >
                <Image
                  fallback={fallbackImage}
                  className='bk-list__img'
                  width={item.styleW}
                  height={item.styleH}
                  style={{ animationDelay: `${key * 0.1}s` }}
                  src={item.preview}
                />
                <div className='bk-list__tool'>
                  <p className='bk-list__info'>
                    {item.width} <span>{item.width}</span> / {item.height}
                    <span>{item.height}</span>
                  </p>
                </div>
                <a
                  href={item.url}
                  className='bk-list__down'
                  target='_blank'
                  rel='noopener noreferrer'
                  data-id={item.id}
                  onClick={handleDownload}
                >
                  <FaDownload />
                </a>
              </figure>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </PerfectScrollbar>
  );
});
