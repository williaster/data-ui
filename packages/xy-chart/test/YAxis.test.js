import React from 'react';
import { shallow } from 'enzyme';
import { AxisLeft, AxisRight } from '@vx/axis';
import { XYChart, YAxis, LineSeries } from '../src/';

describe('<YAxis />', () => {
  const chartProps = {
    xScale: { type: 'band' },
    yScale: { type: 'linear' },
    width: 200,
    height: 200,
    ariaLabel: 'label',
  };

  test('it should be defined', () => {
    expect(YAxis).toBeDefined();
  });

  test('it should not render without a scale', () => {
    expect(shallow(<YAxis />).type()).toBeNull();
  });

  test('<XYChart/> should render an Axis', () => {
    const wrapper = shallow(<XYChart {...chartProps}><YAxis /></XYChart>);
    expect(wrapper.find(YAxis).length).toBe(1);
  });

  test('<XYChart/> should pass scale and innerWidth props', () => {
    const wrapper = shallow(<XYChart {...chartProps}><YAxis /></XYChart>);
    const axis = wrapper.find(YAxis);
    expect(typeof axis.prop('innerWidth')).toBe('number');
    expect(typeof axis.prop('scale')).toBe('function');
  });

  test('<XYChart/> should pass it theme axis and tick styles', () => {
    const yAxisStyles = { stroke: 'pink', strokeWidth: 1, label: {} };
    const yTickStyles = { stroke: 'purple', tickLength: 5 };
    const wrapper = shallow(
      <XYChart {...chartProps} theme={{ yAxisStyles, yTickStyles }}><YAxis /></XYChart>,
    );

    const axis = wrapper.find(YAxis);
    expect(axis.prop('axisStyles')).toEqual(yAxisStyles);
    expect(axis.prop('tickStyles')).toEqual(yTickStyles);
  });

  test('It should render the appropriate axis based on props.orientation', () => {
    const defaultAxis = shallow(<XYChart {...chartProps}><YAxis /></XYChart>)
      .find(YAxis).dive();

    const rightAxis = shallow(<XYChart {...chartProps}><YAxis orientation="right" /></XYChart>)
      .find(YAxis).dive();

    const leftAxis = shallow(<XYChart {...chartProps}><YAxis orientation="left" /></XYChart>)
      .find(YAxis).dive();

    expect(defaultAxis.find(AxisRight).length).toBe(1);
    expect(defaultAxis.find(AxisLeft).length).toBe(0);

    expect(rightAxis.find(AxisRight).length).toBe(1);
    expect(rightAxis.find(AxisLeft).length).toBe(0);

    expect(leftAxis.find(AxisRight).length).toBe(0);
    expect(leftAxis.find(AxisLeft).length).toBe(1);
  });

  test('It should render a label if passed', () => {
    const label = <text id="label" />;
    const wrapper = shallow(
      <XYChart {...chartProps}><YAxis label={label} /></XYChart>,
    );
    expect(wrapper.render().find('#label').length).toBe(1);
  });

  test('It should use a tickLabelComponent and tickFormat func when passed', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <LineSeries label="" data={[{ x: 'a', y: 7 }]} />
        <YAxis
          tickFormat={tickFormat}
          tickLabelComponent={<text className="test" />}
        />
      </XYChart>,
    );
    const label = wrapper.render().find('.test');
    expect(label.first().text()).toBe(tickFormat());
  });
});
