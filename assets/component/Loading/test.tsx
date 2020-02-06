import 'jest';
import React from 'react';
import { render } from '@testing-library/react';
import Loading from '~component/Loading';
import wrapper from '~test/util/wrapper';

const LoadingTest = wrapper(<Loading />);

describe('<Loading />', () => {
  it('render correctly is loading', () => {
    const { container } = render(<LoadingTest />);
    expect(container).toBeTruthy();
  });

  it(`render correctly isn't loading`, () => {
    const { container } = render(<LoadingTest value={{ loading: false }} />);
    expect(container).toBeTruthy();
  });
});
