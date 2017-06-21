import React from 'react';
import { shallow } from 'enzyme';
import { AxisBottom, AxisTop } from '@vx/axis';
import { scaleLinear } from '@vx/scale';
import XAxis from '../src/components/XAxis';

describe('<XAxis />', () => {
  const props = {
    scale: scaleLinear({ range: [0, 10], domain: [-5, 400] }),
    height: 100,
  };

  test('it should be defined', () => {
    expect(XAxis).toBeDefined();
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const bottomAxis = shallow(<XAxis {...props} orientation="bottom" />);
    const topAxis = shallow(<XAxis {...props} orientation="top" />);

    expect(bottomAxis.find(AxisBottom).length).toBe(1);
    expect(bottomAxis.find(AxisTop).length).toBe(0);

    expect(topAxis.find(AxisBottom).length).toBe(0);
    expect(topAxis.find(AxisTop).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const label = <text id="label" />;
    const wrapper = shallow(<XAxis {...props} label={label} />);
    expect(wrapper.render().find('#label').length).toBe(1);
  });

  test('It should use a tickLabelComponent and tickFormat func when passed', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <XAxis
        {...props}
        tickFormat={tickFormat}
        tickLabelComponent={<text className="test" />}
      />,
    );
    const label = wrapper.render().find('.test');
    expect(label.first().text()).toBe(tickFormat());
  });
});
