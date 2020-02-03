/* eslint-disable @typescript-eslint/ban-ts-ignore */
import 'jest';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { EventAction } from '~model/event';
import fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';
import Background from '~component/Background';

describe.only('<Background />', () => {
  it('render correctly', () => {
    const { container } = render(<Background />);
    expect(container).toBeTruthy();
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('render image', done => {
    const events = {};
    const imgBase64 = fs
      .readFileSync(path.resolve(__dirname, '../../image/ablum.png'))
      .toString('base64');
    //@ts-ignore
    jest.spyOn(ipcRenderer, 'on').mockImplementation((event, handler) => {
      events[event] = handler;
    });
    //@ts-ignore
    jest.spyOn(ipcRenderer, 'send').mockImplementation((event, data) => {
      events[event](event, data);
    });
    const { container } = render(<Background />);
    act(() => {
      ipcRenderer.send(EventAction.SET_BACKGROUND, imgBase64);
      fireEvent.load(container.querySelector('img')!);
    });
    expect(container).toBeTruthy();
    expect(container.querySelector('img')?.getAttribute('src')).toBe(imgBase64);
    done();
  });
});
