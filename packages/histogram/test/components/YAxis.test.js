import React from 'react';
import { shallow } from 'enzyme';
import { AxisLeft, AxisRight } from '@vx/axis';
import { scaleLinear } from '@vx/scale';
import { YAxis } from '../../src/';

describe('<YAxis />', () => {
  const props = {
    scale: scaleLinear({ range: [], domain: [] }),
  };

  test('it should be defined', () => {
    expect(YAxis).toBeDefined();
  });

  test('it should not render without a scale', () => {
    expect(shallow(<YAxis />).type()).toBeNull();
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const defaultAxis = shallow(<YAxis {...props} />);
    const leftAxis = shallow(<YAxis {...props} orientation="left" />);
    const rightAxis = shallow(<YAxis {...props} orientation="right" />);

    expect(defaultAxis.find(AxisLeft).length).toBe(1);
    expect(defaultAxis.find(AxisRight).length).toBe(0);

    expect(leftAxis.find(AxisLeft).length).toBe(1);
    expect(leftAxis.find(AxisRight).length).toBe(0);

    expect(rightAxis.find(AxisLeft).length).toBe(0);
    expect(rightAxis.find(AxisRight).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const wrapper = shallow(<YAxis {...props} label="apple" />);
    expect(wrapper.render().find('.vx-axis-label').first().text()).toBe('apple');
  });
});
