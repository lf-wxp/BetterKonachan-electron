import 'jest';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Selector from '~component/Selector';
import { EventAction } from '~model/event';
import { ipcRenderer } from 'electron';

jest.mock('electron');

describe('<Selector />', () => {
  it('render correctly', () => {
    const { container } = render(<Selector />);
    act(() => {
      fireEvent.click(container.querySelector('.bk-selector')!);
    });
    expect(container).toBeTruthy();
    expect(ipcRenderer.send).toBeCalledWith(EventAction.SET_BACKGROUND_DIR);
    expect(ipcRenderer.send).toBeCalledTimes(1);
  });
});
