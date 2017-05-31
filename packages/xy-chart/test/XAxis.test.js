import React from 'react';
import { shallow } from 'enzyme';
import { AxisBottom, AxisTop } from '@vx/axis';
import { XYChart, XAxis, LineSeries } from '../src/';

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
    const label = <text id="label" />;
    const wrapper = shallow(
      <XYChart {...chartProps}><XAxis label={label} /></XYChart>,
    );
    expect(wrapper.render().find('#label').length).toBe(1);
  });

  test('It should use a tickLabelComponent and tickFormat func when passed', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <LineSeries label="" data={[{ x: 'a', y: 7 }]} />
        <XAxis
          tickFormat={tickFormat}
          tickLabelComponent={<text className="test" />}
        />
      </XYChart>,
    );
    const label = wrapper.render().find('.test');
    expect(label.first().text()).toBe(tickFormat());
  });
});
