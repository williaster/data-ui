import React from 'react';
import { shallow } from 'enzyme';
import { AxisLeft, AxisRight } from '@vx/axis';
import { scaleLinear } from '@vx/scale';
import YAxis from '../src/components/YAxis';

describe('<YAxis />', () => {
  const props = {
    scale: scaleLinear({ range: [0, 10], domain: [-5, 400] }),
    width: 100,
  };

  test('it should be defined', () => {
    expect(YAxis).toBeDefined();
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const leftAxis = shallow(<YAxis {...props} orientation="left" />);
    const rightAxis = shallow(<YAxis {...props} orientation="right" />);

    expect(leftAxis.find(AxisLeft).length).toBe(1);
    expect(leftAxis.find(AxisRight).length).toBe(0);

    expect(rightAxis.find(AxisLeft).length).toBe(0);
    expect(rightAxis.find(AxisRight).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const label = <text id="label" />;
    const wrapper = shallow(<YAxis {...props} label={label} />);
    expect(wrapper.render().find('#label').length).toBe(1);
  });

  test('It should use a tickLabelComponent and tickFormat func when passed', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <YAxis
        {...props}
        tickFormat={tickFormat}
        tickLabelComponent={<text className="test" />}
      />,
    );
    const label = wrapper.render().find('.test');
    expect(label.first().text()).toBe(tickFormat());
  });
});
