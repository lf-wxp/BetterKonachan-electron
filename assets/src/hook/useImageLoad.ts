import { useEffect, useRef, useState } from 'react';
import ImagePool from '~module/imagePool';
import { map, find, propEq } from 'ramda';

export default <T>(
  imgs: T[],
  filter: (item: T) => string,
  prop: string,
  limit = 4
): T[] => {
  const [images, setImages] = useState([] as T[]);
  const imagePool = useRef((null as unknown) as ImagePool);

  useEffect(() => {
    imagePool.current = new ImagePool({
      images: map(filter, imgs),
      onLoad: (url): void => {
        setImages(prev => [...prev, find(propEq(prop, url), imgs)]);
      },
      onError: (): void => {},
      limit
    });
  }, [JSON.stringify(imgs)]);

  return images;
};
