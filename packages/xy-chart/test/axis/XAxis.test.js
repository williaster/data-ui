import React from 'react';
import { shallow } from 'enzyme';
import AxisBottom from '@vx/axis/build/axis/AxisBottom';
import AxisTop from '@vx/axis/build/axis/AxisTop';
import { XYChart, XAxis, LineSeries } from '../../src/';

describe('<XAxis />', () => {
  const chartProps = {
    xScale: { type: 'band' },
    yScale: { type: 'linear' },
    width: 200,
    height: 200,
    ariaLabel: 'label',
  };

  test('it should be defined', () => {
    expect(XAxis).toBeDefined();
  });

  test('it should not render without a scale', () => {
    expect(shallow(<XAxis />).type()).toBeNull();
  });

  test('<XYChart/> should render an Axis', () => {
    const wrapper = shallow(<XYChart {...chartProps}><XAxis /></XYChart>);
    expect(wrapper.find(XAxis).length).toBe(1);
  });

  test('<XYChart/> should pass scale and innerHeight props', () => {
    const wrapper = shallow(<XYChart {...chartProps}><XAxis /></XYChart>);
    const axis = wrapper.find(XAxis);
    expect(typeof axis.prop('innerHeight')).toBe('number');
    expect(typeof axis.prop('scale')).toBe('function');
  });

  test('<XYChart/> should pass it theme axis and tick styles', () => {
    const xAxisStyles = { stroke: 'pink', strokeWidth: 1, label: {} };
    const xTickStyles = { stroke: 'purple', tickLength: 5 };
    const wrapper = shallow(
      <XYChart {...chartProps} theme={{ xAxisStyles, xTickStyles }}><XAxis /></XYChart>,
    );

    const axis = wrapper.find(XAxis);
    expect(axis.prop('axisStyles')).toEqual(xAxisStyles);
    expect(axis.prop('tickStyles')).toEqual(xTickStyles);
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const defaultAxis = shallow(<XYChart {...chartProps}><XAxis /></XYChart>)
      .find(XAxis).dive();

    const bottomAxis = shallow(<XYChart {...chartProps}><XAxis orientation="bottom" /></XYChart>)
      .find(XAxis).dive();

    const topAxis = shallow(<XYChart {...chartProps}><XAxis orientation="top" /></XYChart>)
      .find(XAxis).dive();

    expect(defaultAxis.find(AxisBottom).length).toBe(1);
    expect(defaultAxis.find(AxisTop).length).toBe(0);

    expect(bottomAxis.find(AxisBottom).length).toBe(1);
    expect(bottomAxis.find(AxisTop).length).toBe(0);

    expect(topAxis.find(AxisBottom).length).toBe(0);
    expect(topAxis.find(AxisTop).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const wrapper = shallow(
      <XYChart {...chartProps}><XAxis label="banana" /></XYChart>,
    );
    expect(wrapper.render().find('.vx-axis-label').first().text()).toBe('banana');
  });

  test('It should use the output of tickFormat() for ticks', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <LineSeries label="" data={[{ x: 'a', y: 7 }]} />
        <XAxis tickFormat={tickFormat} />
      </XYChart>,
    );
    const tick = wrapper.render().find('.vx-axis-tick').first();
    expect(tick.find('text').text()).toBe(tickFormat());
  });
});
