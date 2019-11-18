import { ImageDetail } from '~model/image';
import { Download } from '~cModel/download';

export interface Ctx {
  bgUri: string;
  items: ImageDetail[];
  pages: number;
  page: number;
  security: boolean;
  expand: boolean;
  download: Download[];
  loading: boolean;
}
