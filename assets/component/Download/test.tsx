import 'jest';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Download from '~component/Download';
import mockImage from '~test/mock/file';
import { ipcRenderer } from 'electron';
import { EventDownload } from '~model/event';
import wrapper from '~test/util/wrapper';

const DownloadTest = wrapper(<Download />);

describe('<Download />', () => {
  it('render correctly', () => {
    const { container } = render(<DownloadTest />);
    expect(container).toBeTruthy();
  });

  it('render right download list item length', () => {
    const value = {
      download: [
        {
          url: mockImage,
          sample: 100,
          percent: 100,
          status: 'success'
        }
      ]
    };
    const { container } = render(<DownloadTest value={value} />);
    expect(container).toBeTruthy();
    expect(container.querySelectorAll('.bk-download__item').length).toBe(1);
  });

  it('retry download', () => {
    const value = {
      download: [
        {
          url: mockImage,
          sample: 100,
          percent: 0,
          status: 'error'
        }
      ]
    };
    const { container } = render(<DownloadTest value={value} />);
    jest.spyOn(ipcRenderer, 'send').mockImplementation();
    fireEvent.click(container.querySelector('.bk-download__retry')!);
    expect(ipcRenderer.send).toBeCalledWith(EventDownload.DOWNLOAD, {
      url: mockImage
    });
    expect(ipcRenderer.send).toBeCalledTimes(1);
    (ipcRenderer.send as any).mockRestore();
  });

  it('update the status and percent', () => {
    const value = {
      download: [
        {
          url: mockImage,
          sample: 100,
          percent: 0,
          status: 'init'
        }
      ]
    };
    const { container } = render(<DownloadTest value={value} />);
    act(() => {
      ipcRenderer.send(EventDownload.STATUS, {
        progress: 100,
        status: 'success',
        url: mockImage
      });
    });
    expect(container.querySelectorAll('.bk-download__icon').length).toBe(1);
  });
});
