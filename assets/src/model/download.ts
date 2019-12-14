export interface Download {
  url: string;
  sample: string;
  percent: string;
  status: 'error' | 'progress' | 'success' | 'init';
}
