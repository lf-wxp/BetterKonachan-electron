import { IMAGEAPIJSON, IMAGEPAGESIZE, IMAGEURLXML } from '~config';
import { catchError, map, pluck, switchMap, tap } from 'rxjs/operators';
import { of, zip, Observable } from 'rxjs';

import { ImageDetail } from '~model/image';
import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import querystring from 'querystring';
import { retryWithDelay } from 'rxjs-retry-delay';

interface ImageResData {
  pages: number;
  images: ImageDetail[];
}

export const parseXmlData = (xmlData: string): ImageResData => {
  const $: CheerioStatic = cheerio.load(xmlData);
  const pages = Math.floor(
    Number.parseInt($('posts').attr('count'), 10) / IMAGEPAGESIZE
  );
  const images: ImageDetail[] = [];
  $('post').map((index, post) => {
    const attrs = post.attribs;
    images.push({
      id: index,
      url: attrs.file_url,
      sampleWidth: Number.parseInt(attrs.sample_width, 10),
      sampleHeight: Number.parseInt(attrs.sample_height, 10),
      sample: attrs.sample_url,
      preview: attrs.preview_url,
      previewWidth: Number.parseInt(attrs.actual_preview_width, 10),
      previewHeight: Number.parseInt(attrs.actual_preview_height, 10),
      width: Number.parseInt(attrs.width, 10),
      height: Number.parseInt(attrs.height, 10),
      tags: attrs.tags,
      security: attrs.rating === 's' ? true : false,
      name: `${attrs.md5}${path.extname(attrs.file_url)}`
    });
  });

  return {
    pages,
    images
  };
};

export const imageXmlObservable = ({
  page = 1,
  tags = ''
}: {
  page: number;
  tags: string;
}): Observable<ImageResData> => {
  const params$ = of<{ page: number; tags: string }>({ page, tags });
  const url$ = of<string>(IMAGEURLXML);
  return zip(params$, url$).pipe(
    // eslint-disable-next-line jsx-control-statements/jsx-jcs-no-undef
    tap(() => console.log('image post')),
    switchMap(([{ page, tags }, url]) =>
      axios.get(`${url}?${querystring.stringify({ page, tags })}`)
    ),
    pluck('data'),
    map((xmlData: string) => parseXmlData(xmlData)),
    retryWithDelay({
      delay: 1000,
      scalingFactor: 2,
      maxRetryAttempts: 4
    }),
    catchError(() => {
      return of({
        images: [],
        pages: -1
      });
    })
  );
};

export const imageJsonObservable = ({
  page = 1,
  tags = ''
}: {
  page: number;
  tags: string;
}): Observable<ImageResData> => {
  const params$ = of<{ page: number; tags: string }>({ page, tags });
  const url$ = of<string>(IMAGEAPIJSON);
  return zip(params$, url$).pipe(
    switchMap(([{ page, tags }, url]) =>
      axios.get(`${url}?${querystring.stringify({ page, tags })}`)
    ),
    pluck('data', 'data'),
    retryWithDelay({
      delay: 1000,
      scalingFactor: 2,
      maxRetryAttempts: 4
    }),
    catchError(() => {
      return of({
        images: [],
        pages: -1
      });
    })
  );
};
