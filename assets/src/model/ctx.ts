import { IImage } from '~model/image';

export interface ICtx {
  bgUri?: string;
  items?: IImage[];
  pages: number;
  page: number;
}
