import 'jest';
import React from 'react';
import { render, act } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import { EventImage } from '~model/event';
import Service from '~component/Service';
import wrapper from '~test/util/wrapper';

const ServiceTest = wrapper(<Service />);

describe('<Serivce />', () => {
  it('render correctly', () => {
    const { container } = render(<ServiceTest />);
    act(() => {
      ipcRenderer.send(EventImage.DATA, {
        images: [],
        pages: 0
      });
    });
    expect(container).toBeTruthy();
  });
});
