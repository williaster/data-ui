import React from 'react';
import { shallow } from 'enzyme';
import { AxisBottom, AxisTop } from '@vx/axis';
import { scaleLinear } from '@vx/scale';
import { XAxis } from '../../src/';

describe('<XAxis />', () => {
  const props = {
    scale: scaleLinear({ range: [], domain: [] }),
  };

  test('it should be defined', () => {
    expect(XAxis).toBeDefined();
  });

  test('it should not render without a scale', () => {
    expect(shallow(<XAxis />).type()).toBeNull();
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const defaultAxis = shallow(<XAxis {...props} />);
    const bottomAxis = shallow(<XAxis {...props} orientation="bottom" />);
    const topAxis = shallow(<XAxis {...props} orientation="top" />);

    expect(defaultAxis.find(AxisBottom).length).toBe(1);
    expect(defaultAxis.find(AxisTop).length).toBe(0);

    expect(bottomAxis.find(AxisBottom).length).toBe(1);
    expect(bottomAxis.find(AxisTop).length).toBe(0);

    expect(topAxis.find(AxisBottom).length).toBe(0);
    expect(topAxis.find(AxisTop).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const wrapper = shallow(<XAxis {...props} label="banana" />);
    expect(wrapper.render().find('.vx-axis-label').first().text()).toBe('banana');
  });
});
