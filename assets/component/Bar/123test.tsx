import 'jest';
import React from 'react';
import { shallow } from 'enzyme';
// import { ipcRenderer } from 'electron';
// import { EventWindow } from '~model/event';
// jest.mock('electron');

import Bar from '~component/Bar';

describe('<Bar />', () => {
  it('render correctly', () => {
    const result = shallow(<Bar />);
    expect(result).toBeTruthy();
    expect(result.find('.bk-bar__close')).toBeTruthy();
    expect(result.find('.bk-bar__expand')).toBeTruthy();
    expect(result.find('.bk-bar__mini')).toBeTruthy();
  });

  it('fire the event', () => {
    const result = shallow(<Bar />);
    result.find('.bk-bar__close').simulate('click');
    // expect(ipcRenderer.send).toBeCalledWith(EventWindow.COLOSE);
    result.find('.bk-bar__expand').simulate('click');
    // expect(ipcRenderer.send).toBeCalledWith(EventWindow.MAX);
    result.find('.bk-bar__mini').simulate('click');
    // expect(ipcRenderer.send).toBeCalledWith(EventWindow.MIN);
    // expect(ipcRenderer.send).toBeCalledTimes(3);
  });
});
