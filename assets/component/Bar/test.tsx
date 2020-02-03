import 'jest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import { EventWindow } from '~model/event';
import Bar from '~component/Bar';

jest.mock('electron');

describe('<Bar />', () => {
  it('render correctly', () => {
    const { container } = render(<Bar />);
    expect(container).toBeTruthy();
    expect(container.querySelector('.bk-bar__close')).toBeTruthy();
    expect(container.querySelector('.bk-bar__expand')).toBeTruthy();
    expect(container.querySelector('.bk-bar__mini')).toBeTruthy();
  });

  it('fire the event', () => {
    const { container } = render(<Bar />);
    fireEvent.click(container.querySelector('.bk-bar__close')!);
    expect(ipcRenderer.send).toBeCalledWith(EventWindow.COLOSE);
    fireEvent.click(container.querySelector('.bk-bar__expand')!);
    expect(ipcRenderer.send).toBeCalledWith(EventWindow.MAX);
    fireEvent.click(container.querySelector('.bk-bar__mini')!);
    expect(ipcRenderer.send).toBeCalledTimes(3);
  });
});
