import 'jest';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { EventAction } from '~model/event';
import { ipcRenderer } from 'electron';
import Background from '~component/Background';
import mockImage from '~test/mock/file';

describe.only('<Background />', () => {
  it('render correctly', () => {
    const { container } = render(<Background />);
    expect(container).toBeTruthy();
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('render image', () => {
    const { container } = render(<Background />);
    act(() => {
      ipcRenderer.send(EventAction.SET_BACKGROUND, mockImage);
      fireEvent.load(container.querySelector('img')!);
    });
    expect(container).toBeTruthy();
    expect(container.querySelector('img')?.getAttribute('src')).toBe(mockImage);
  });
});
