import 'jest';
import React from 'react';
import { render } from '@testing-library/react';
import Progress from '~component/Progress';

describe('<Progress />', () => {
  it('render correctly', () => {
    const { container } = render(<Progress percent={'100%'} />);
    expect(container).toBeTruthy();
  });
});
