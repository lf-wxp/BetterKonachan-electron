import React from 'react';
import { shallow } from 'enzyme';
import 'jest';

import Page from '~component/Page';

describe('<Page />', () => {
  it('render correctly', () => {
    const result = shallow(<Page />);
    expect(result).toBeTruthy();
  });
});
