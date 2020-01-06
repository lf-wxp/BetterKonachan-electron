const color = {
  hex: 'red',
}

const getSwatches = () => {
  return Promise.resolve({
    Vibrant: color,
    Muted: color,
  });
}

export const from = (img: any) => {
  console.log('image', img);
  return getSwatches;
}
