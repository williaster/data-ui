import React from 'react';
import { shallow } from 'enzyme';

import { RadialChart } from '../src';

describe('<RadialChart />', () => {
  const mockProps = {
    ariaLabel: 'This is a pie chart of ...',
    width: 100,
    height: 100,
    children: <g />,
  };

  test('it should be defined', () => {
    expect(RadialChart).toBeDefined();
  });

  test('it should render an svg', () => {
    const wrapper = shallow(<RadialChart {...mockProps} />);
    expect(wrapper.find('svg').length).toBe(1);
  });
});
