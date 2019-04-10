import React, { useState } from 'react';
import './style.css';

interface IProps {
  src: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  width?: number;
}

enum EImageState {
  loaded = 'loaded',
  pendding = 'pendding',
  error = 'error'
};

export default ({ src, fallback, className, style, width, height }: IProps) => {
  const [state, setState] = useState(EImageState.pendding);
  const [animationEnd, setAnimationEnd] = useState(false);
  const [isError, setIsError] = useState(false);
  const onLoad = (e: React.FormEvent<HTMLImageElement>) => {
    if (!isError) {
      setState(EImageState.loaded);
    }
  }

  const onError = (e: React.FormEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    setState(EImageState.error);
    setIsError(true);
    if (fallback) {
      target.src = fallback;
    }
  }
  const onAnimationEnd = () => {
    setAnimationEnd(true);
  }
  return (
    <div className={`imageBox ${animationEnd ? 'anmationend' : ''}`} style={{ width: width as number - 10, height: height as number - 10 }}>
      <img
        src={src}
        style={style}
        className={`${className} image  ${state}`}
        onAnimationEnd={onAnimationEnd}
        onError={onError}
        onLoad={onLoad}/>
    </div>
  )
}
