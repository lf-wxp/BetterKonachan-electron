import React from 'react';
import { Ctx } from '~cModel/ctx';
import { ColorSet } from '~cModel/colorSet';
import {
  Action,
  EAction,
  UpdateProgressPayload,
  TReducer,
  Context
} from '~cModel/action';
import { ImageDetail } from '~model/image';
import { Download } from '~cModel/download';
import { clone } from 'ramda';

interface CtxProps {
  value: Ctx;
}

const initState: Ctx = {
  pages: 0,
  page: 0,
  security: true,
  download: [],
  colorSet: {
    vibrant: '#39cccc',
    muted: '#0984e3'
  },
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
  loading: true,
  tags: ''
};

const reducer: TReducer = (state: Ctx, { type, payload }: Action): Ctx => {
  switch (type) {
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
      const { percent, status, url } = payload as UpdateProgressPayload;
      const tmp: Download[] = clone(download);
      const target = tmp.find(item => decodeURI(item.url) === decodeURI(url));
      if (!target) {
        return { ...state };
      }
      if (['progress', 'success'].includes(status)) {
        target.percent = percent;
      }
      target.status = status;

      return { ...state, download: tmp };
    case EAction.setBaseColor:
      return { ...state, colorSet: payload as ColorSet };
    case EAction.setTags:
      return { ...state, tags: payload as string };
    default:
      return { ...state };
  }
};

const Context: React.Context<Context> = React.createContext<Context>({
  state: initState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
