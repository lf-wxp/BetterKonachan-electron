export interface IImage {
  id: number;
  sampleWidth: number;
  sampleHeight: number;
  sample: string;
  previewWidth: number;
  previewHeight: number;
  preview: string;
  url: string;
  width: number;
  height: number;
  security: boolean;
  name: string;
  tags: string;
}

export interface IImageList {
  images: IImage[];
  pages: number;
  page?: number;
}
