import { ipcRenderer } from 'electron';
import React, { CSSProperties, useContext, useCallback } from 'react';
import { FaDownload } from 'react-icons/fa';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useMeasure } from 'react-use';
import Image from '~component/Image';
import useImageLoad from '~hook/useImageLoad';
import useWaterfall from '~hook/useWaterfall';
import fallbackImage from '~image/loaderror.png';
import Context from '~assets/context';

import { TFunc1Void, TFunc2 } from '~util';
import { EventDownload } from '~model/event';
import { ImageDetail } from '~model/image';
import { EAction } from '~cModel/action';
import { Download } from '~cModel/download';
import { ImageDom } from '~cModel/imageDom';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.pcss';

const maxWidth = 300;
const minWidth = 200;

export default React.memo(() => {
  const {
    state: { items, download, security },
    dispatch
  } = useContext(Context);
  const [refDom, { width }] = useMeasure<HTMLDivElement>();
  const images = useImageLoad<ImageDetail>(items, 'preview');
  const list = useWaterfall({
    security,
    maxWidth,
    minWidth,
    width,
    images
  });

  const handleDownload: TFunc1Void<React.FormEvent<
    HTMLAnchorElement
  >> = useCallback(
    (e: React.FormEvent<HTMLAnchorElement>): void => {
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
    },
    [dispatch, download, items]
  );

  const combineStyle: TFunc2<
    CSSProperties,
    number,
    CSSProperties
  > = useCallback(
    (style: CSSProperties, key: number): CSSProperties => ({
      ...style,
      transitionDelay: `${key * 0.05}s`
    }),
    []
  );

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
