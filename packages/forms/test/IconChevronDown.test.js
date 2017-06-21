import React from 'react';
import { render } from 'enzyme';

import IconChevronDown from '../src/icons/IconChevronDown';

describe('<IconChevronDown />', () => {
  test('it should be defined', () => {
    expect(IconChevronDown).toBeDefined();
  });

  it('it should render an <svg>', () => {
    const wrapper = render(<IconChevronDown />);
    expect(wrapper.find('svg').length).toBe(1);
  });
});
