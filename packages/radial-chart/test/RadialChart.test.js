import React from 'react';
import { shallow } from 'enzyme';

import { RadialChart, WithTooltip, radialChartPropTypes } from '../src';

describe('<RadialChart />', () => {
  const mockProps = {
    ariaLabel: 'This is a pie chart of ...',
    width: 100,
    height: 100,
    children: <g />,
  };

  it('should be defined', () => {
    expect(RadialChart).toBeDefined();
  });

  it('radialChartPropTypes should be defined', () => {
    expect(radialChartPropTypes).toBeDefined();
  });

  it('should render an svg', () => {
    const wrapper = shallow(<RadialChart {...mockProps} />);
    expect(wrapper.find('svg')).toHaveLength(1);
  });

  it('should render a <WithTooltip /> if renderTooltip is passed', () => {
    let wrapper = shallow(<RadialChart {...mockProps} renderTooltip={null} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(0);

    wrapper = shallow(<RadialChart {...mockProps} renderTooltip={() => {}} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(1);
  });
});
