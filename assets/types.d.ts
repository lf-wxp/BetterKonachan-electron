declare module '*.json' {
  const value: string;
  export default value;
}
declare module '*.pcss' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module 'electron-download-manager' {
  const DownloadManager: any;
  export default DownloadManager;
}

declare module 'electron-ipc-mock';
