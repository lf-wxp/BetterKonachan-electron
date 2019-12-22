import React, {
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState
} from 'react';
import Context from '~src/context';
import Vibrant from 'node-vibrant';
import { CSSVariable } from '~module/cssVariable';
import { EAction } from '~cModel/action';
import { ipcRenderer } from 'electron';

import bg0 from '~image/bg0.jpg';
import bg1 from '~image/bg1.jpg';
import bg2 from '~image/bg2.jpg';
import bg3 from '~image/bg3.jpg';

import './style.pcss';
import { EventAction } from '~model/event';

const bgs: string[] = [bg0, bg1, bg2, bg3];

const bgUri: string = bgs[Math.floor(Math.random() * 13)];
export default React.memo(() => {
  const { dispatch } = useContext(Context);
  const [uri, setUri] = useState(bgUri);
  const img = useRef((null as unknown) as HTMLImageElement);

  const onLoad = useCallback(async () => {
    const palette = await Vibrant.from(img.current).getSwatches();
    const vibrantColor = palette.Vibrant?.hex!;
    const mutedColor = palette.Muted?.hex!;
    CSSVariable.setValue('--themeBaseColor', vibrantColor);
    CSSVariable.setValue('--themeMutedColor', mutedColor);
    dispatch({
      type: EAction.setBaseColor,
      payload: { vibrant: vibrantColor, muted: mutedColor }
    });
  }, [img, dispatch]);

  useEffect(() => {
    ipcRenderer.on(EventAction.SET_BACKGROUND, (__, uri) => {
      setUri(uri);
    });
  }, []);

  return (
    <figure className='bk-bg'>
      <img
        ref={img}
        src={uri}
        className='bk-bg__image'
        alt='bg'
        onLoad={onLoad}
      />
    </figure>
  );
});
