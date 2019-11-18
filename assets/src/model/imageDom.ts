import { ImageDetail } from '~model/image';
import { CSSProperties } from 'react';

export interface ImageDom extends ImageDetail {
  styleH?: number;
  styleW?: number;
  style?: CSSProperties;
  full?: boolean;
}
