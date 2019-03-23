import * as React from 'react';
import { ICtx } from '~cModel/ctx';
import { IAction } from '~cModel/action';


const initState: ICtx = {
  bgUri: '',
  pages: 0,
  items: [{
    id: 0,
    sampleWidth: 0,
    sampleHeight: 0,
    sample: '',
    previewWidth: 0,
    previewHeight: 0,
    preview: '',
    url: '',
    width: 0,
    height: 0,
    security: false,
    name: '',
  }],
};

const reducer = (state: Partial<ICtx>, { type, payload }: IAction<ICtx>) => {
  switch(type) {
    case 'updateState':
      return { ...state, ...payload };
    default:
      return { ...state };
  }
};

const Context = React.createContext<{state: ICtx; dispatch?: any}>({ state: initState });

const Provider = (props: { children: React.ReactNode; value: ICtx }) => {
  const [state, dispatch] = React.useReducer(reducer, props.value);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
    );
};
export { Provider };

export default Context;

