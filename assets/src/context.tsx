import React from 'react';
import { Ctx } from '~cModel/ctx';
import {
  Action,
  EAction,
  UpdateProgressPayload,
  TReducer,
  Context
} from '~cModel/action';
import { ImageDetail } from '~model/image';
import { Download } from '~cModel/download';

interface CtxProps {
  value: Ctx;
}

const initState: Ctx = {
  bgUri: '',
  pages: 0,
  page: 0,
  security: true,
  expand: false,
  download: [],
  items: [
    {
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
      tags: '',
      security: false,
      name: ''
    }
  ],
  loading: true
};

const reducer: TReducer = (state: Ctx, { type, payload }: Action): Ctx => {
  switch (type) {
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
      return { ...state, items: payload as ImageDetail[] };
    case EAction.setDownload:
      return { ...state, download: payload as Download[] };
    case EAction.setLoading:
      return { ...state, loading: payload as boolean };
    case EAction.setDownloadStatus:
      const { download } = state;
      const { index, percent, status } = payload as UpdateProgressPayload;
      const tmp: Download[] = [...download];
      if (status === 'progress') {
        tmp[index].percent = percent;
      }
      if (status === 'error') {
        tmp[index].error = true;
      }

      return { ...state, download: tmp };
    default:
      return { ...state };
  }
};

const Context: React.Context<Context> = React.createContext<Context>({
  state: initState,
  dispatch: (): void => {}
});

const Provider: React.StatelessComponent<CtxProps> = (
  props: React.PropsWithChildren<CtxProps>
): React.ReactElement => {
  const [state, dispatch] = React.useReducer(reducer, props.value);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export { Provider };

export default Context;
