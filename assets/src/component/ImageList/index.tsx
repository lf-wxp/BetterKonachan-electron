import React, { useEffect,  useContext, useRef, useState, CSSProperties} from 'react';
import Context from '~src/context';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Image from '~component/Image';
import fallbackImage from '~image/loaderror.png';
import { FaDownload } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ipcRenderer } from 'electron';

import { IImageDom } from '~cModel/imageDom';
import { EAction } from '~cModel/action';
import { IImage } from '~model/image';
import { IDownload } from '~cModel/download';
import { TFuncVoid, TFunc1Void, TFunc1, TFunc2, TFunc3, TFuncVoidReturn } from '~util';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';


function isValidDom(dom: HTMLElement | null): dom is HTMLElement {

  return dom !== null && dom.parentElement !== null;
}

let columnArray: number[] = [0];
const maxWidth: number = 300;
const minWidth: number = 200;

const shortestColumn: TFuncVoidReturn<{ height: number; index: number }> = (): { height: number; index: number} => {
  const min: number = Math.min(...columnArray);
  const index: number = columnArray.indexOf(min);

  return {
    height: min,
    index
  };
};

const calcColumnWidth: TFunc1<HTMLElement | null, { column: number; width: number }> =
 (dom: HTMLElement | null): { column: number; width: number } => {
  if (isValidDom(dom)) {
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
      width
    };
  } else {

    return {
      column: 0,
      width: 0
    };
  }
};

const calcColumnArray: TFunc1Void<number> = (h: number): void => {
  const { index, height } = shortestColumn();
  columnArray.splice(index, 1, height + h);
};

const calcPosition: TFunc1<number, { x: number; y: number }> = (w: number): { x: number; y: number } => {
  const { height, index } = shortestColumn();
  const offsetX: number = index * w;
  const offsetY: number = height;

  return {
      x: offsetX,
      y: offsetY
  };
};

const calcList: TFunc2<IImage[], number, IImageDom[]> = (items: IImage[], width: number): IImageDom[] => {

  return items.map((item: IImage, i: number) => {
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
};


const updateLayout: TFunc3<IImage[], HTMLElement | null, boolean, IImageDom[]> =
   (items: IImage[], dom: HTMLElement | null, security: boolean): IImageDom[] => {
  const { column, width } = calcColumnWidth(dom);
  // tslint:disable-next-line: prefer-array-literal
  columnArray = new Array(column).fill(0);
  const filterItem: IImage[]  = items.filter((item: IImage) => security ? item.security : true);

  return calcList(filterItem, width);
};


export default React.memo(() => {
  const { state: { items, download, security }, dispatch } = useContext(Context);
  const refDom: React.MutableRefObject<null> = useRef(null);
  const winWidthState: [number, React.Dispatch<React.SetStateAction<number>>] = useState(window.innerWidth);
  let handler: number;
  let list: IImageDom[];
  list = updateLayout(items, refDom.current, security);
  const debounceHandler: TFuncVoid = (): void => {
    if (handler) {
      clearTimeout(handler);
    }
    handler = window.setTimeout(() => {
      list = updateLayout(items, refDom.current, security);
      winWidthState[1](window.innerWidth);
    }, 500);
  };
  const handleDownload: TFunc1Void<React.FormEvent<HTMLAnchorElement>> = (e: React.FormEvent<HTMLAnchorElement>) : void => {
    e.preventDefault();
    const target: HTMLElement = e.currentTarget;
    const { index } = target.dataset;
    const filterItem: IImage[] = items.filter((it: IImage) => security ? it.security : true);
    const item: IImage = filterItem[Number.parseInt(index as string, 10)];
    const previewUrl: string = item.preview;
    const data: IDownload = {
      url: previewUrl,
      percent: '0%'
    };
    if (!download.find(({ url }: { url: string}) => url === data.url)) {
      dispatch({
        type: EAction.setDownload,
        payload: [...download, data ]
      });
      ipcRenderer.send('download', { url: item.url, index: download.length });
    }
  };

  useEffect((): TFuncVoid => {
    window.addEventListener('resize', debounceHandler);

    return (): void => {
      window.removeEventListener('resize', debounceHandler);
    };
  }, []);

  const combineStyle: TFunc2<CSSProperties, number, CSSProperties> = (style: CSSProperties, key: number): CSSProperties => {

    return {
      ...style,
      transitionDelay: `${key * 0.02}s`
    };
  };

  return (
      <PerfectScrollbar>
        <div ref={refDom} className='listWrap'>
          <TransitionGroup>
            {list.map((item: IImageDom, key: number) => (
              <CSSTransition key={item.name} timeout={5000} classNames='flip'>
                <figure key={item.name} style={combineStyle(item.style as CSSProperties, key)} className='listItem'>
                  <Image
                    fallback={fallbackImage}
                    className='listImg'
                    width={item.styleW}
                    height={item.styleH}
                    style={{animationDelay: `${key * 0.1}s`}}
                    src={item.preview} />
                  <div className='listTool'>
                    <p className='listInfo'>{item.width} / {item.height}</p>
                    <a href={item.url} className='listDown' target='_blank' data-index={key} rel='noreferrer' onClick={handleDownload}>
                      <FaDownload />
                    </a>
                  </div>
                </figure>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </PerfectScrollbar>
  );
});
