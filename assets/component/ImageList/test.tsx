import 'jest';
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act, fireEvent } from '@testing-library/react';
import ImageList from '~component/ImageList';
import mockImage from '~test/mock/file';
import wrapper from '~test/util/wrapper';
import { ipcRenderer } from 'electron';
import { EventDownload } from '~model/event';

jest.mock('electron');

jest.mock('react-use', () => ({
  useMeasure: (): [null, { width: number }] => [null, { width: 100 }]
}));

const ImageListTest = wrapper(<ImageList />);

const value = {
  items: [
    {
      id: 1,
      sampleWidth: 100,
      sampleHeight: 100,
      sample: mockImage,
      previewWidth: 50,
      previewHeight: 50,
      preview: mockImage,
      url: mockImage,
      width: 100,
      height: 100,
      security: false,
      name: 'test',
      tags: 'tag'
    },
    {
      id: 1,
      sampleWidth: 100,
      sampleHeight: 100,
      sample: '',
      previewWidth: 50,
      previewHeight: 50,
      preview: '',
      url: '',
      width: 100,
      height: 100,
      security: false,
      name: 'test',
      tags: 'tag'
    }
  ],
  security: false,
  download: []
};

describe('<ImageList />', () => {
  let container: Element | null = null;
  beforeEach(() => {
    // 创建一个 DOM 元素作为渲染目标
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // 退出时进行清理
    unmountComponentAtNode(container!);
    container?.remove();
    container = null;
  });

  it('render correctly', async () => {
    await act(async () => {
      ReactDOM.render(<ImageListTest value={value} />, container);
    });
    expect(container!.querySelectorAll('.bk-list__item').length).toBe(1);
  });

  it('fire the download event', async () => {
    await act(async () => {
      ReactDOM.render(<ImageListTest value={value} />, container);
    });
    act(() => {
      fireEvent.click(container?.querySelector('.bk-list__down')!);
    });
    expect(container?.querySelector('.bk-list__down')).toBeTruthy();
    expect(ipcRenderer.send).toBeCalledTimes(1);
    expect(ipcRenderer.send).toBeCalledWith(EventDownload.DOWNLOAD, {
      url: mockImage
    });
  });
});
