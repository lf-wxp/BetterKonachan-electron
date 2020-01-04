import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import Context from '~assets/context';
import { EAction } from '~cModel/action';
import { TFuncVoid, TFunc2, TFunc1Void } from '~util';
import { EventImage } from '~model/event';
import mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';

import './style.pcss';

const size = 4;
const getPageArray: TFunc2<number, number, number[]> = (
  page: number,
  pages: number
): number[] => {
  if (pages <= 0) {
    return [];
  }
  const half: number = Math.floor(size / 2);
  const navpage: number[] = [];
  if (page > half && page < pages - half) {
    let i: number = page - half;
    let j = 0;
    while (j < size) {
      navpage.push(i);
      i += 1;
      j += 1;
    }
  }
  if (page <= half) {
    let i = 1;
    let j = 0;
    while (j < size) {
      navpage.push(i);
      j += 1;
      i += 1;
    }
  }
  if (page >= pages - half) {
    let i: number = pages - size + 1;
    let j = 0;
    while (j < size) {
      navpage.push(i);
      j += 1;
      i += 1;
    }
  }

  return navpage;
};

export default React.memo(() => {
  const {
    state: { page, pages, tags },
    dispatch
  } = useContext(Context);
  const pageArray: number[] = getPageArray(page, pages);
  const [statePage, setStatePage] = useState();

  const getData: (p: number, tags?: string) => void = useCallback(
    (p: number): void => {
      ipcRenderer.send(EventImage.POST, { page: p, tags });
      dispatch({
        type: EAction.setPage,
        payload: p
      });
      dispatch({
        type: EAction.setLoading,
        payload: true
      });
    },
    [dispatch, tags]
  );

  const invoke: TFunc1Void<React.FormEvent<HTMLLIElement>> = (
    event: React.FormEvent<HTMLLIElement>
  ): void => {
    const { id } = event.currentTarget.dataset;
    const p: number = Number.parseInt(id as string, 10);
    getData(p);
  };

  const onChange: TFunc1Void<React.ChangeEvent> = (
    event: React.ChangeEvent
  ): void => {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
    const val: string = target.value;
    const value: string = val.replace(/[^0-9]/g, '');
    let num: number | string = Number.parseInt(value, 10) || '';
    if (num > pages) {
      num = pages;
    }
    if (num < 0) {
      num = 1;
    }
    setStatePage(num);
  };

  const goTo: TFunc1Void<React.FormEvent<HTMLButtonElement>> = (
    event: React.FormEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    getData(statePage);
  };

  const prev: TFuncVoid = useCallback((): void => {
    if (page - 1 > 0) {
      getData(page - 1);
    }
  }, [getData, page]);

  const next: TFuncVoid = useCallback((): void => {
    if (page + 1 < pages) {
      getData(page + 1);
    }
  }, [getData, page, pages]);

  useEffect(() => {
    mousetrap.bindGlobal('right', () => {
      next();
    });
    mousetrap.bindGlobal('left', () => {
      prev();
    });

    return (): void => {
      mousetrap.unbind('right');
      mousetrap.unbind('left');
    };
  }, [next, prev]);

  return (
    <section className={`bk-pager ${pageArray.length ? 'active' : ''}`}>
      <span
        className={`bk-pager_nav ${page - 1 ? '' : 'disabled'}`}
        onClick={prev}
        role='button'
      >
        <i />
      </span>
      <span
        className={`bk-pager_nav ${pages - page > 0 ? '' : 'disabled'}`}
        onClick={next}
        role='button'
      >
        <i />
      </span>
      <div className='bk-pager_con'>
        <ul className='bk-pager_box'>
          {pageArray.map((item: number) => (
            <li
              className={`bk-pager_item ${page === item ? 'current' : ''} ${
                page >= 102 ? 'middle' : ''
              }`}
              onClick={invoke}
              key={item}
              data-id={item}
              role='button'
            >
              <span className='bk-pager_item-text'>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <form className='bk-pager_go'>
        <em className='bk-pager_go-em' />
        <div className='bk-pager_go-div'>
          <span className='bk-pager_go-span'>{pages}</span>
        </div>
        <div className='bk-pager_go-div'>
          <input
            className='bk-pager_go-input'
            type='text'
            placeholder='page'
            name='pager'
            value={statePage}
            onChange={onChange}
          />
        </div>
        <button className='bk-pager_btn' onClick={goTo}>
          <span />
        </button>
      </form>
      <div className='bk-pager_holder' />
    </section>
  );
});
