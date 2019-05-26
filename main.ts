import electron, { app, BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import * as Splashscreen from '@trodi/electron-splashscreen';
import { isValidType, TFuncVoid } from '~util';
import { download } from 'electron-dl';
// import { getImageData, getImagePage } from '~module/image';
import { getImageJsonData } from '~module/image';
// import { IImage } from '~model/image';
import path from 'path';

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

  mainWindow.on(
    'closed',
    (): void => {
      mainWindow = null;
    }
  );
};

app.on('ready', createWindow);

app.on(
  'window-all-closed',
  (): void => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
);

app.on(
  'activate',
  (): void => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  }
);

ipcMain.on(
  'image-post',
  async (
    event: Electron.Event,
    { page, tags }: { page: number; tags: string }
  ): Promise<void> => {
    // const pages: number = await getImagePage();
    // const images: IImage[] = await getImageData({ page, tags });
    const { images, pages } = await getImageJsonData({ page, tags });

    console.log('jsonnnnnnnnnnnnnnnnnnnnnnnnnnnnn', images, pages);
    event.sender.send('image-data', { images, pages, page });
  }
);

ipcMain.on(
  'window-close',
  (): void => {
    if (isValidType<Electron.BrowserWindow>(mainWindow)) {
      mainWindow.close();
    }
  }
);

ipcMain.on(
  'window-min',
  (): void => {
    if (isValidType<Electron.BrowserWindow>(mainWindow)) {
      mainWindow.minimize();
    }
  }
);

ipcMain.on(
  'window-max',
  (): void => {
    if (isValidType<Electron.BrowserWindow>(mainWindow)) {
      const [width, height] = mainWindow.getSize();
      if (screen.width === width && screen.height === height) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  }
);

ipcMain.on(
  'download',
  (event: Electron.Event, { url, index }: { url: string; index: number }) => {
    download(mainWindow as BrowserWindow, url, {
      onProgress: (progress: number): void => {
        event.sender.send('progress', { progress, index });
      }
    }).catch((err: Error) => {
      console.error(err);
    });
  }
);
