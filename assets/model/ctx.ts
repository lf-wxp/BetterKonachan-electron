import { ImageDetail } from '~model/image';
import { Download } from '~cModel/download';
import { ColorSet } from '~cModel/colorSet';

export interface Ctx {
  items: ImageDetail[];
  pages: number;
  page: number;
  security: boolean;
  download: Download[];
  loading: boolean;
  colorSet: ColorSet;
  tags: string;
}
