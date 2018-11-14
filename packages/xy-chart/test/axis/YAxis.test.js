import React from 'react';
import { shallow } from 'enzyme';
import { AxisLeft, AxisRight } from '@vx/axis';
import { scaleLinear } from '@vx/scale';
import { Text } from '@vx/text';
import { XYChart, YAxis, LineSeries } from '../../src';

describe('<YAxis />', () => {
  const chartProps = {
    xScale: { type: 'band' },
    yScale: { type: 'linear' },
    width: 200,
    height: 200,
    ariaLabel: 'label',
  };

  it('should be defined', () => {
    expect(YAxis).toBeDefined();
  });

  it('should not render without a scale', () => {
    expect(shallow(<YAxis />).type()).toBeNull();
  });

  it('<XYChart/> should render an Axis', () => {
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <YAxis />
      </XYChart>,
    );
    expect(wrapper.find(YAxis)).toHaveLength(1);
  });

  it('<XYChart/> should pass scale and innerWidth props', () => {
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <YAxis />
      </XYChart>,
    );
    const axis = wrapper.find(YAxis);
    expect(typeof axis.prop('innerWidth')).toBe('number');
    expect(typeof axis.prop('scale')).toBe('function');
  });

  it('<XYChart/> should pass it theme axis and tick styles', () => {
    const yAxisStyles = { stroke: 'pink', strokeWidth: 1, label: {} };
    const yTickStyles = { stroke: 'purple', tickLength: 5 };
    const wrapper = shallow(
      <XYChart {...chartProps} theme={{ yAxisStyles, yTickStyles }}>
        <YAxis />
      </XYChart>,
    );

    const axis = wrapper.find(YAxis);
    expect(axis.prop('axisStyles')).toEqual(yAxisStyles);
    expect(axis.prop('tickStyles')).toEqual(yTickStyles);
  });

  it('should render the appropriate axis based on props.orientation', () => {
    const defaultAxis = shallow(
      <XYChart {...chartProps}>
        <YAxis />
      </XYChart>,
    )
      .find(YAxis)
      .dive();

    const rightAxis = shallow(
      <XYChart {...chartProps}>
        <YAxis orientation="right" />
      </XYChart>,
    )
      .find(YAxis)
      .dive();

    const leftAxis = shallow(
      <XYChart {...chartProps}>
        <YAxis orientation="left" />
      </XYChart>,
    )
      .find(YAxis)
      .dive();

    expect(defaultAxis.find(AxisRight)).toHaveLength(1);
    expect(defaultAxis.find(AxisLeft)).toHaveLength(0);

    expect(rightAxis.find(AxisRight)).toHaveLength(1);
    expect(rightAxis.find(AxisLeft)).toHaveLength(0);

    expect(leftAxis.find(AxisRight)).toHaveLength(0);
    expect(leftAxis.find(AxisLeft)).toHaveLength(1);
  });

  it('should render a label if passed', () => {
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <YAxis label="apple" />
      </XYChart>,
    );
    expect(
      wrapper
        .render()
        .find('.vx-axis-label')
        .first()
        .text(),
    ).toBe('apple');
  });

  it('should pass the height prop as labelProps.width for wrapping', () => {
    const wrapper = shallow(
      <YAxis
        scale={scaleLinear({ range: [0, 100], domain: [0, 100] })}
        innerWidth={100}
        label="test"
        height={chartProps.height}
      />,
    );
    expect(wrapper.find(AxisRight).prop('labelProps').width).toBe(chartProps.height);
  });

  it('should use the output of tickFormat() when passed', () => {
    const tickFormat = () => 'iNvaRiAnT LabEl';
    const wrapper = shallow(
      <XYChart {...chartProps}>
        <LineSeries label="" data={[{ x: 'a', y: 7 }]} />
        <YAxis tickFormat={tickFormat} />
      </XYChart>,
    );
    const tick = wrapper
      .render()
      .find('.vx-axis-tick')
      .first();
    expect(tick.find('text').text()).toBe(tickFormat());
  });

  it('should render a custom tickComponent if passed', () => {
    const wrapper = shallow(
      <YAxis
        scale={scaleLinear({ range: [0, 100], domain: [0, 100] })}
        innerWidth={100}
        tickComponent={() => <text id="test" />}
      />,
    );

    expect(
      wrapper
        .find(AxisRight)
        .dive() // Axis
        .dive() // Group
        .find('.vx-axis-tick')
        .first()
        .dive()
        .find('#test'),
    ).toHaveLength(1);
  });

  it('tickLabelProps should be passed tick value and indexif passed, and tickStyles.label[orientation] if not', () => {
    const props = {
      scale: scaleLinear({ range: [100, 0], domain: [0, 100] }),
      innerWidth: 100,
    };

    const wrapper = shallow(
      <YAxis
        {...props}
        tickLabelProps={(val, i) => ({
          fill: i === 0 ? 'pink' : 'blue',
        })}
      />,
    );

    const label0 = wrapper
      .find(AxisRight)
      .dive() // Axis
      .dive() // Group
      .find('.vx-axis-tick')
      .first()
      .dive()
      .childAt(1) // Text
      .dive()
      .find('svg')
      .find('text');

    const label1 = wrapper
      .find(AxisRight)
      .dive() // Axis
      .dive() // Group
      .find('.vx-axis-tick')
      .last()
      .dive()
      .childAt(1) // Text
      .dive()
      .find('svg')
      .find('text');

    expect(label0.prop('fill')).toBe('pink');
    expect(label1.prop('fill')).toBe('blue');
  });

  it('tickStyles.label[orientation] should be used if tickLabelProps is not passed', () => {
    const props = {
      scale: scaleLinear({ range: [100, 0], domain: [0, 100] }),
      innerWidth: 100,
    };

    const wrapper = shallow(
      <YAxis
        {...props}
        tickLabelProps={null}
        tickStyles={{
          label: {
            right: {
              fill: 'skyblue',
            },
          },
        }}
      />,
    );

    const label0 = wrapper
      .find(AxisRight)
      .dive() // Axis
      .dive() // Group
      .find('.vx-axis-tick')
      .first()
      .dive()
      .childAt(1) // Text
      .dive()
      .find('svg')
      .find('text');

    expect(label0.prop('fill')).toBe('skyblue');
  });
});
