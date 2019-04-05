import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    transparent: true,
    height: 600,
    width: 800,
    frame: false,
  });
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9999/index.html');
  } else {
    mainWindow.loadFile(path.join(__dirname, './assets/dist/index.html'));
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

ipcMain.on('custom-get-images', (): void => {

});
