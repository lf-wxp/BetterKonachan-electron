import 'jest';
import React from 'react';
import { render } from '@testing-library/react';
import Wave from '~component/Wave';

describe('<Wave />', () => {
  it('render correctly', () => {
    const { container } = render(<Wave height={100} />);
    expect(container).toBeTruthy();
  });
});
