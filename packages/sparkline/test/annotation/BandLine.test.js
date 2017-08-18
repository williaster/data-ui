import React from 'react';
import { shallow } from 'enzyme';
import Bar from '@vx/shape/build/shapes/Bar';

import { Sparkline, BandLine } from '../../src/';

describe('<BandLine />', () => {
  const sparklineProps = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10).fill().map((_, i) => i),
  };

  test('it should be defined', () => {
    expect(BandLine).toBeDefined();
  });

  test('it should render null if no accessors or scales are passed', () => {
    expect(shallow(<BandLine />)).toBeNull();
  });

  test('it should render a Bar', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <BandLine />
      </Sparkline>,
    ).find(BandLine).dive();

    expect(wrapper.find(Bar).length).toBe(1);
  });

  test('innerquartiles type bands should span the entire width of the chart', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <BandLine />
      </Sparkline>,
    ).find(BandLine).dive();

    const bar = wrapper.find(Bar);
    expect(bar.prop('x')).toBe(0);
    expect(bar.prop('width')).toBe(sparklineProps.width);
  });

  test('it should render a band for custom-coordinate bands', () => {
    const band = {
      from: { x: 3, y: 2 },
      to: { x: 7, y: 6 },
    };

    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <BandLine band={band} />
      </Sparkline>,
    ).find(BandLine);

    const xScale = wrapper.prop('xScale');
    const yScale = wrapper.prop('yScale');
    const scaledBand = {
      from: { x: xScale(band.from.x), y: yScale(band.from.y) },
      to: { x: xScale(band.to.x), y: yScale(band.to.y) },
    };

    const bar = wrapper.dive().find(Bar);
    expect(bar.prop('x')).toBe(scaledBand.from.x);
    expect(bar.prop('y')).toBe(Math.min(scaledBand.from.y, scaledBand.to.y));
    expect(bar.prop('width')).toBe(scaledBand.to.x - scaledBand.from.x);
    expect(bar.prop('height')).toBe(Math.abs(scaledBand.from.y - scaledBand.to.y));
  });

  test('custom-coordinate bands with missing x or y values should default to chart bounds', () => {
    const emptyBand = { from: {}, to: {} };

    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <BandLine band={emptyBand} />
      </Sparkline>,
    ).find(BandLine);

    const bar = wrapper.dive().find(Bar);
    expect(bar.prop('x')).toBe(0);
    expect(bar.prop('y')).toBe(0);
    expect(bar.prop('width')).toBe(sparklineProps.width);
    expect(bar.prop('height')).toBe(sparklineProps.height);
  });
});
