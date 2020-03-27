export type IRxEventPayLoad<T> = [Electron.IpcMainEvent, T];

export enum EventWindow {
  CLOSE = 'window-close',
  MAX = 'window-max',
  MIN = 'window-min'
}

export enum EventDownload {
  DOWNLOAD = 'download',
  STATUS = 'download-status'
}

export enum EventImage {
  POST = 'image-post',
  DATA = 'image-data'
}

export enum EventAction {
  SET_BACKGROUND_DIR = 'set-background-dir',
  SET_BACKGROUND = 'set-background'
}
