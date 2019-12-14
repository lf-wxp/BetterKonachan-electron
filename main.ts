import * as Splashscreen from '@trodi/electron-splashscreen';

import { TFuncVoid, isValidType } from '~util';
import electron, { app, ipcMain } from 'electron';
import { fromEvent, of, zip } from 'rxjs';
import { map, mergeAll, debounceTime } from 'rxjs/operators';

import { IRxEventPayLoad } from '~model/event';
import { imageXmlObservable } from '~module/image';
import path from 'path';
import { EventImage, EventDownload, EventWindow } from '~model/event';
import windowStateKeeper from 'electron-window-state';
import DownloadManager from 'electron-download-manager';
import unhandled from 'electron-unhandled';

let mainWindow: Electron.BrowserWindow | null;
let mainWindowState: windowStateKeeper.State;
let screen: { width: number; height: number };

DownloadManager.register();
unhandled();

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

  fromEvent(mainWindow, 'closed').subscribe(() => {
    mainWindow = null;
  });
};

fromEvent(app, 'ready').subscribe(createWindow);

fromEvent(app, 'window-all-closed').subscribe(
  () => process.platform !== 'darwin' && app.quit()
);

fromEvent(app, 'activate').subscribe(
  () => mainWindow === null && createWindow()
);

fromEvent(ipcMain, EventImage.POST)
  .pipe(
    debounceTime(1000),
    map(([e, params]) => zip(imageXmlObservable(params), of(e))),
    mergeAll()
  )
  .subscribe(([{ images, pages }, event]) => {
    event.sender.send(EventImage.DATA, { images, pages });
  });

fromEvent(ipcMain, EventWindow.COLOSE).subscribe(
  () => isValidType<Electron.BrowserWindow>(mainWindow) && mainWindow.close()
);

fromEvent(ipcMain, EventWindow.MIN).subscribe(
  () => isValidType<Electron.BrowserWindow>(mainWindow) && mainWindow.minimize()
);

fromEvent(ipcMain, EventWindow.MAX).subscribe(() => {
  if (isValidType<Electron.BrowserWindow>(mainWindow)) {
    const [width, height] = mainWindow.getSize();
    if (screen.width === width && screen.height === height) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

fromEvent(ipcMain, EventDownload.DOWNLOAD).subscribe(
  ([event, { url }]: IRxEventPayLoad<{
    url: string;
  }>) => {
    let zeroCount = 0;
    DownloadManager.download(
      {
        url,
        onProgress: (progress: any, item: any): void => {
          const speed = Number.parseFloat(
            /(\d+\.?\d*)/.exec(progress.speed)?.[0] || '0'
          );
          if (speed === 0) {
            zeroCount += 1;
          }
          if (zeroCount > 300000 || item.getState() === 'interrupted') {
            item.cancel();
            event.sender.send(EventDownload.STATUS, {
              status: 'error',
              progress: progress.progress,
              url
            });
          } else {
            event.sender.send(EventDownload.STATUS, {
              status: 'progress',
              progress: progress.progress,
              url
            });
          }
        }
      },
      (err: Error, { url }: { url: string }) => {
        event.sender.send(EventDownload.STATUS, {
          status: err ? 'error' : 'success',
          url,
          ...(!err ? { progress: 100 } : {})
        });
      }
    );
  }
);
