import { retry, mergeMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

const imagePromise = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = (): void => {
      resolve(url);
    };
    img.onerror = (err): void => {
      reject(err);
    };
    img.src = url;
  });

class ImagePool {
  private images: string[];
  private limit: number;
  private pool: Map<string, unknown>;
  private onLoad: (image: string) => void;
  private onError: (err: Event | string) => void;

  constructor({
    images,
    onLoad,
    onError,
    limit
  }: {
    images: string[];
    onLoad: (image: string) => void;
    onError: (err: Event | string) => void;
    limit: number;
  }) {
    this.images = images;
    this.onLoad = onLoad;
    this.onError = onError;
    this.limit = limit;
    this.pool = new Map();
    this.init();
  }

  init(): void {
    this.addImage();
  }

  createImage(url: string): Subscription {
    return of(url)
      .pipe(
        mergeMap(url => imagePromise(url)),
        retry(2)
      )
      .subscribe(
        url => {
          this.onLoad(url);
        },
        err => {
          this.onError(err);
        },
        () => {
          this.cleanResolved(url);
          this.addImage();
        }
      );
  }

  addImage(): void {
    if (this.images.length <= 0) {
      return;
    }
    const url = this.images.pop();
    if (this.pool.size < this.limit) {
      this.pool.set(url as string, this.createImage(url as string));
    }
  }

  cleanResolved(url: string): void {
    this.pool.delete(url);
  }
}

export default ImagePool;
