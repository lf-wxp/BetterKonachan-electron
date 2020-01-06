import 'jest';
import React from 'react';
import { shallow } from 'enzyme';
import { render, act } from '@testing-library/react';
import { EventAction } from '~model/event';
import fs from 'fs';
import path from 'path';
// import { CSSVariable } from '~module/cssVariable';
// import { ipc} from 'electron-ipc-mock';
// import { remote } from 'electron';
import { ipcRenderer } from 'electron';
// import img from '~image/bg0.jpg';

import Background from '~component/Background';

describe.only('<Background />', () => {
  it('render correctly', () => {
    const result = shallow(<Background />);
    expect(result).toBeTruthy();
    expect(result.find('img')).toBeTruthy();
  });

  it('render image', done => {
    const events = {};
    const imgBase64 = fs.readFileSync(path.resolve(__dirname, 'ablum.png')).toString('base64');
    //@ts-ignore
    jest.spyOn(ipcRenderer, 'on').mockImplementation((event, handler) => {
      events[event] = handler;
    });
    //@ts-ignore
    jest.spyOn(ipcRenderer, 'send').mockImplementation((event, data) => {
      events[event](event, data);
    });
    const { container } = render(<Background />);
    // remote.getCurrentWebContents().send(EventAction.SET_BACKGROUND, img);
    act(() => {
      ipcRenderer.send(EventAction.SET_BACKGROUND, imgBase64);
    });
    expect(container).toBeTruthy();
    expect(container.querySelector('img')?.getAttribute('src')).toBe(imgBase64);
    // expect(CSSVariable.getValue('--themejBaseColor')).toBe('red');
    done();
  });
});
