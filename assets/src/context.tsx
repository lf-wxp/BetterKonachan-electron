import React from 'react';
import { ICtx } from '~cModel/ctx';
import { IAction, EAction, IUpdateProgressPayload } from '~cModel/action';
import { IImage } from '~model/image';
import { IDownload } from '~cModel/download';

const initState: ICtx = {
  bgUri: '',
  pages: 0,
  page: 0,
  security: true,
  expand: false,
  download: [],
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
  loading: true,
};

const reducer = (state: ICtx, { type, payload }: IAction) => {
  switch(type) {
    case EAction.setBgUri:
      return { ...state, bgUri: payload as string };
    case EAction.setExpand:
      return { ...state, expand: payload as boolean };
    case EAction.setPage:
      return { ...state, page: payload as number };
    case EAction.setPages:
      return { ...state, pages: payload as number };
    case EAction.setSecurity:
      return { ...state, security: payload as boolean };
    case EAction.setItems:
      return { ...state, items: payload as IImage[] };
    case EAction.setDownload:
      return { ...state, download: payload as IDownload[] };
    case EAction.setLoading:
      return { ...state, loading: payload as boolean };
    case EAction.setProgress:
      const { download } = state;
      const { index, percent } = payload as IUpdateProgressPayload;
      const tmp = [...download];
      tmp[index].percent = percent;
      return { ...state, download: tmp };
    default:
      return { ...state };
  }
};

const Context = React.createContext<{state: ICtx; dispatch: React.Dispatch<IAction>}>({ state: initState, dispatch: () => {} });

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

