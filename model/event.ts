export type IRxEventPayLoad<T> = [Electron.IpcMainEvent, T];

export enum EventWindow {
  COLOSE = 'window-close',
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
