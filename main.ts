import { app, BrowserWindow, ipcMain } from 'electron';
import { isValidType }  from '~util';
import { download } from 'electron-dl';
import { Image } from '~module/image';
import { IImage } from '~model/image';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow | null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
  });
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9999/index.html');
  } else {
    mainWindow.loadFile(path.resolve(app.getAppPath(), './dist/index.html'));
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', (): void => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('image-post', async (event: Electron.Event, { page, tags }: { page: number; tags:string; }): Promise<void> => {
  const pages: number = await Image.getPage();
  const images: IImage[] = await Image.getData({ page, tags });
  event.sender.send('image-data', { images, pages, page });
});


ipcMain.on('window-close', (): void => {
  if (isValidType<Electron.BrowserWindow>(mainWindow)) {
    mainWindow.close();
  }
});

ipcMain.on('window-min', (): void => {
  if (isValidType<Electron.BrowserWindow>(mainWindow)) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-max', (): void => {
  if (isValidType<Electron.BrowserWindow>(mainWindow)) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('download', (event: Electron.Event, { url, index }: { url: string; index: number }) => {
  download(mainWindow as BrowserWindow, url, {
    onProgress: (progress: number) => {
      event.sender.send('progress', { progress, index });
    },
  });
});
