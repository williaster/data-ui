import React from 'react';
import { render } from 'enzyme';

import IconX from '../src/icons/IconX';

describe('<IconX />', () => {
  test('it should be defined', () => {
    expect(IconX).toBeDefined();
  });

  it('it should render an <svg>', () => {
    const wrapper = render(<IconX />);
    expect(wrapper.find('svg').length).toBe(1);
  });
});
