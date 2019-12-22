import React from 'react';
import { shallow } from 'enzyme';
import 'jest';

import Bar from '~component/Bar';

describe('<Bar />', () => {
  it('render correctly', () => {
    const result = shallow(<Bar />);
    expect(result).toBeTruthy();
  });
});
