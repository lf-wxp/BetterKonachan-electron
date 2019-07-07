import * as Splashscreen from '@trodi/electron-splashscreen';

import { TFuncVoid, isValidType } from '~util';
import electron, { BrowserWindow, app, ipcMain } from 'electron';
import { fromEvent, of, zip } from 'rxjs';
import { map, mergeAll, debounceTime } from 'rxjs/operators';

import { IRxEventPayLoad } from '~model/event';
import { download } from 'electron-dl';
import { imageXmlObservable } from '~module/image';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

let mainWindow: Electron.BrowserWindow | null;
let mainWindowState: windowStateKeeper.State;
let screen: { width: number; height: number };

const createWindow: TFuncVoid = (): void => {
  screen = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindowState = windowStateKeeper({
    defaultHeight: 600,
    defaultWidth: 800
  });

  const windowOpts: Electron.BrowserWindowConstructorOptions = {
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  };

  mainWindow = Splashscreen.initSplashScreen({
    windowOpts,
    templateUrl: path.resolve(app.getAppPath(), './dist/splash.svg'),
    delay: 0,
    minVisible: 1500,
    splashScreenOpts: {
      height: 200,
      width: 200,
      transparent: true
    }
  });

  mainWindowState.manage(mainWindow);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9999/index.html');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.resolve(app.getAppPath(), './dist/index.html'));
  }

  fromEvent(mainWindow, 'closed')
  .subscribe(() => {
    mainWindow = null;
  });
};


fromEvent(app, 'ready')
.subscribe(createWindow);

fromEvent(app, 'window-all-closed')
.subscribe(() => process.platform !== 'darwin' && app.quit());

fromEvent(app, 'activate')
.subscribe(() => mainWindow === null && createWindow());

fromEvent(ipcMain, 'image-post').pipe(
  debounceTime(1000),
  map(([e, params]) => zip(imageXmlObservable(params), of(e))),
  mergeAll(),
)
.subscribe(([{ images, pages }, event]) => {
  event.sender.send('image-data', { images, pages });
});


fromEvent(ipcMain, 'window-close')
.subscribe(() => isValidType<Electron.BrowserWindow>(mainWindow) && mainWindow.close());

fromEvent(ipcMain, 'window-min')
.subscribe(() => isValidType<Electron.BrowserWindow>(mainWindow) && mainWindow.minimize())

fromEvent(ipcMain, 'window-max')
.subscribe(() => {
  if (isValidType<Electron.BrowserWindow>(mainWindow)) {
    const [width, height] = mainWindow.getSize();
    if (screen.width === width && screen.height === height) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

fromEvent(ipcMain, 'download')
.subscribe(([event, { url, index }]: IRxEventPayLoad<{ url: string; index: number }>) => {
  download(mainWindow as BrowserWindow, url, {
    onProgress: (progress: number): void => {
      event.sender.send('progress', { progress, index });
    }
  }).catch((err: Error) => {
    console.error(err);
  });
});
