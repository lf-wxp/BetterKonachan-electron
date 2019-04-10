import React, { useContext, useState } from 'react';
import { ipcRenderer } from 'electron';

import Context from '~src/context';
import { EAction } from '~cModel/action';

import './style.css';

const size = 4;
const getPageArray = (page: number, pages: number): number[] => {
  if (pages === 0) return [];
  const half: number = Math.floor(size / 2);
  const navpage: number[] = [];
  if (page > half && page < pages - half) {
    let i: number = page - half;
    let j: number = 0;
    while (j < size) {
      navpage.push(i);
      i += 1;
      j += 1;
    }
  }
  if (page <= half) {
    let i: number = 1;
    let j: number = 0;
    while (j < size) {
      navpage.push(i);
      j += 1;
      i += 1;
    }
  }
  if (page >= pages - half) {
    let i: number = pages - size + 1;
    let j: number = 0;
    while (j < size) {
      navpage.push(i);
      j += 1;
      i += 1;
    }
  }

  return navpage;
}
export default React.memo(() => {
  const { state: { page, pages }, dispatch } = useContext(Context);
  const pageArray = getPageArray(page, pages);
  const [statePage, setStatePage] = useState();

  const getData = (page: number, tags: string = ''): void => {
    ipcRenderer.send('image-post', { page, tags })
    dispatch({
      type: EAction.setPage,
      payload: page,
    });
    dispatch({
      type: EAction.setLoading,
      payload: true,
    });
  }
  const invoke = (event: React.FormEvent<HTMLLIElement>) => {
    const { id } = event.currentTarget.dataset;
    const page = Number.parseInt(id as string, 10);
    getData(page);
  }


  const onChange = (event: React.ChangeEvent): void => {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
    const val: string = target.value;
    const value = val.replace(/[^0-9]/g, '');
    let num: number | string = Number.parseInt(value, 10) || '';
    if (num > pages) {
        num = pages;
    }
    if (num < 0) {
        num = 1;
    }
    setStatePage(num);
  }

  const goTo = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    getData(statePage);
  }

  const prev = (): void => {
    if (page - 1 > 0) {
      getData(page - 1);
    }
  }

  const next = (): void => {
    if (page + 1 < pages) {
      getData(page + 1);
    }
  }

  return (
    <section className={`pager ${pageArray.length ? 'active': ''}`}>
      <span className={`pNav ${page - 1 ? '' : 'disabled'}`} onClick={prev}>
        <i />
      </span>
      <span className={`pNav ${pages - page > 0 ? '':'disabled'}`} onClick={next}>
        <i />
      </span>
      <div className="pCon">
        <ul className="pBox">
          {pageArray.map((item: number) => (
            <li className={`pItem ${page === item ? 'current': ''}`} onClick={invoke} key={item} data-id={item}>
              <span className="pItemText">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <form className="pGoto">
        <em className="pGotoEm" />
        <div className="pGotoDiv">
          <span className="pGotoSpan">{pages}</span>
        </div>
        <div className="pGotoDiv">
         <input className="pGotoInput" type="text" placeholder="page" name="pager" value={statePage} onChange={onChange} />
        </div>
        <button className="pBtn" onClick={goTo}>
          <span />
        </button>
      </form>
      <div className="pHolder" />
    </section>)
});
