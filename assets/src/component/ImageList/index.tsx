import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.pcss';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { TFunc1, TFunc1Void, TFunc2, TFunc3, TFuncVoidReturn } from '~util';

import Context from '~src/context';
import { EAction } from '~cModel/action';
import { FaDownload } from 'react-icons/fa';
import { Download } from '~cModel/download';
import { ImageDetail } from '~model/image';
import { ImageDom } from '~cModel/imageDom';
import Image from '~component/Image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import fallbackImage from '~image/loaderror.png';
import { ipcRenderer } from 'electron';
import useSize from '~hook/useSize';

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
  if (width) {
    const w: number = width;
    const l: number = w % maxWidth;
    let column: number;
    let colWidth: number;
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

    return {
      column,
      colWidth
    };
  } else {
    return {
      column: 0,
      colWidth: 0
    };
  }
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
  const refDom: React.MutableRefObject<null> = useRef(null);
  const [list, setList] = useState([] as ImageDom[]);
  const { width } = useSize(refDom.current);

  const handleDownload: TFunc1Void<React.FormEvent<HTMLAnchorElement>> = (
    e: React.FormEvent<HTMLAnchorElement>
  ): void => {
    e.preventDefault();
    const target: HTMLElement = e.currentTarget;
    const { index } = target.dataset;
    const filterItem: ImageDetail[] = items.filter((it: ImageDetail) =>
      security ? it.security : true
    );
    const item: ImageDetail = filterItem[Number.parseInt(index as string, 10)];
    const data: Download = {
      url: item.url,
      sample: item.preview,
      percent: '0%'
    };
    if (!download.find(({ url }: { url: string }) => url === data.url)) {
      dispatch({
        type: EAction.setDownload,
        payload: [...download, data]
      });
      ipcRenderer.send('download', { url: item.url, index: download.length });
    }
  };

  useEffect((): void => {
    setList(updateLayout(items, width, security));
  }, [width, items, security]);

  const combineStyle: TFunc2<CSSProperties, number, CSSProperties> = (
    style: CSSProperties,
    key: number
  ): CSSProperties => {
    return {
      ...style,
      transitionDelay: `${key * 0.02}s`
    };
  };

  return (
    <PerfectScrollbar>
      <div ref={refDom} className='listWrap'>
        <TransitionGroup>
          {list.map((item: ImageDom, key: number) => (
            <CSSTransition key={item.name} timeout={5000} classNames='flip'>
              <figure
                key={item.name}
                style={combineStyle(item.style as CSSProperties, key)}
                className='listItem'
              >
                <Image
                  fallback={fallbackImage}
                  className='listImg'
                  width={item.styleW}
                  height={item.styleH}
                  style={{ animationDelay: `${key * 0.1}s` }}
                  src={item.preview}
                />
                <div className='listTool'>
                  <p className='listInfo'>
                    {item.width} / {item.height}
                  </p>
                  <a
                    href={item.url}
                    className='listDown'
                    target='_blank'
                    rel='noopener noreferrer'
                    data-index={key}
                    onClick={handleDownload}
                  >
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
