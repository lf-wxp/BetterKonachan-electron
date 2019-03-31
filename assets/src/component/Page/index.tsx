import * as React from 'react';
import Context from '~src/context';
import './style.css';

const { useContext } = React;
const size = 4;
const getPageArray = (page: number, pages: number): number[] => {
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
  const invoke = (event: React.MouseEvent) => {
    const { id } = (event.currentTarget as HTMLElement).dataset;
    dispatch({ type: 'updateState', payload: { page: Number.parseInt(id as string, 10) }});
  }

  const filterInput = () => {

  }

  const goTo = () => {

  }

  console.log('pageArray', pageArray, page, pages);
  return (
    <section className="pager active">
      <span className={`pNav ${page - 1 ? '' : 'disabled'}`}>
        <i />
      </span>
      <span className={`pNav ${pages - page > 0 ? '':'disabled'}`}>
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
         <input className="pGotoInput" type="text" placeholder="page" name="pager" onChange={filterInput} />
        </div>
        <button className="pBtn" onClick={goTo}>
          <span />
        </button>
      </form>
      <div className="pHolder" />
    </section>)
});
