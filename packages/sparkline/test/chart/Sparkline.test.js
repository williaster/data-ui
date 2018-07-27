import React from 'react';
import { shallow } from 'enzyme';
import { Sparkline, BarSeries, HorizontalReferenceLine } from '../../src';

describe('<Sparkline />', () => {
  const props = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10)
      .fill()
      .map((_, i) => i),
  };

  it('should be defined', () => {
    expect(Sparkline).toBeDefined();
  });

  it('should render an svg', () => {
    const wrapper = shallow(
      <Sparkline {...props}>
        <g />
      </Sparkline>,
    );
    expect(wrapper.find('svg').length).toHaveLength(1);
  });

  it('should store parsed data, dimensions, and scales in state', () => {
    const wrapper = shallow(
      <Sparkline {...props}>
        <g />
      </Sparkline>,
    );
    const state = wrapper.state();
    const { width, height, margin } = props;
    expect(state.innerWidth).toBe(width - margin.left - margin.right);
    expect(state.innerHeight).toBe(height - margin.top - margin.bottom);
    expect(state.xScale).toEqual(expect.any(Function));
    expect(state.yScale).toEqual(expect.any(Function));
    expect(state.data).toEqual(expect.any(Array));
    const { data } = props;
    const expectedDatum = data[0];
    const datum = state.data[0].y;
    expect(Math.abs(datum - expectedDatum)).toBeLessThan(0.00001);
  });

  it('should set min/max according to passed values', () => {
    const wrapper = shallow(
      <Sparkline {...props} min={101} max={1001}>
        <g />
      </Sparkline>,
    );
    const yScale = wrapper.state('yScale');
    const [min, max] = yScale.domain();
    expect(min).toBe(101);
    expect(max).toBe(1001);
  });

  it('should determine y values from the passed value accessor', () => {
    const val = -111;
    const wrapper = shallow(
      <Sparkline {...props} valueAccessor={() => val}>
        <g />
      </Sparkline>,
    );
    const yScale = wrapper.state('yScale');
    const [min, max] = yScale.domain();
    expect(min).toBe(val);
    expect(max).toBe(val);
  });

  it('should render its children', () => {
    const wrapper = shallow(
      <Sparkline {...props}>
        <g id="test" />
      </Sparkline>,
    );
    expect(wrapper.find('#test').length).toHaveLength(1);
  });

  it('should pass xScale, yScale, data, getX, and getY to children of series or line type', () => {
    const wrapper = shallow(
      <Sparkline {...props}>
        <g id="test" />
        <BarSeries />
        <HorizontalReferenceLine />
      </Sparkline>,
    );

    const g = wrapper.find('#test');
    const series = wrapper.find(BarSeries);
    const line = wrapper.find(HorizontalReferenceLine);

    [g, series, line].forEach(component => {
      expect(component.length).toHaveLength(1);
      expect(component.prop('data')).toEqual(component === g ? undefined : expect.any(Array));
      expect(component.prop('xScale')).toEqual(component === g ? undefined : expect.any(Function));
      expect(component.prop('yScale')).toEqual(component === g ? undefined : expect.any(Function));
      expect(component.prop('getX')).toEqual(component === g ? undefined : expect.any(Function));
      expect(component.prop('getY')).toEqual(component === g ? undefined : expect.any(Function));
    });
  });

  it('should render a BarSeries to intercept onMouseMove and onMouseLeave if passed', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <Sparkline {...props} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <g />
      </Sparkline>,
    );

    const bars = wrapper.find(BarSeries);
    const bar = bars.first();
    expect(bars.length).toHaveLength(1);

    bar.simulate('mousemove');
    bar.simulate('mouseleave');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
