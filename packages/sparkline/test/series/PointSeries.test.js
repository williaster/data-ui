import React from 'react';
import { shallow } from 'enzyme';
import GlyphDot from '@vx/glyph/build/glyphs/Dot';

import { Sparkline, PointSeries, Label } from '../../src/';

describe('<PointSeries />', () => {
  const sparklineProps = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10).fill().map((_, i) => i + 1),
  };

  test('it should be defined', () => {
    expect(PointSeries).toBeDefined();
  });

  test('it should render null if no accessors or scales are passed', () => {
    expect(shallow(<PointSeries />).type()).toBeNull();
  });

  test('it should render one GlyphDot per point specified', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries points={['min', 'max']} />
      </Sparkline>,
    ).find(PointSeries).dive();

    expect(wrapper.find(GlyphDot).length).toBe(2);
  });

  test('it should render one GlyphDot per point specified', () => {
    let wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries points={['min', 'max']} />
      </Sparkline>,
    ).find(PointSeries).dive();

    expect(wrapper.find(GlyphDot).length).toBe(2);

    wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries points={['all']} />
      </Sparkline>,
    ).find(PointSeries).dive();

    expect(wrapper.find(GlyphDot).length).toBe(sparklineProps.data.length);
  });

  test('it should pass (yVal, i) to renderLabel, fill, fillOpacity, stroke, strokeWidth, and size func-type props', () => {
    const func = stringOrNumber => (yVal, i) => {
      expect(yVal).toBe(sparklineProps.data[i]);
      expect(i).toEqual(expect.any(Number));
      return stringOrNumber === 'string' ? 'test' : 1;
    };

    shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries
          points={['all']}
          size={func('number')}
          fill={func('string')}
          fillOpacity={func('number')}
          stroke={func('string')}
          strokeWidth={func('number')}
          renderLabel={func('string')}
        />
      </Sparkline>,
    ).find(PointSeries).dive();

    const props = 6;
    const assertionsPerCall = 2;
    expect.assertions(props * sparklineProps.data.length * assertionsPerCall);
  });

  test('it should render a label if returned by renderLabel', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries
          points={['all']}
          renderLabel={(d, i) => (i === 1 || i === 3 ? 'test' : null)}
        />
      </Sparkline>,
    ).find(PointSeries).dive();

    expect(wrapper.find(Label).length).toBe(2);
  });

  test('it should used the passed LabelComponent for the labels', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries
          points={['all']}
          renderLabel={(d, i) => (i === 1 || i === 3 ? 'test' : null)}
          LabelComponent={<text className="test-label" />}
        />
      </Sparkline>,
    ).find(PointSeries).dive();

    expect(wrapper.find('.test-label').length).toBe(2);
  });

  test.only('it should call onMouseMove({ datum, data, index, event, color }) and onMouseLeave() on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <PointSeries
          points={['all']}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
      </Sparkline>,
    ).find(PointSeries).dive();

    const point = wrapper.find(GlyphDot).first();
    point.simulate('mousemove', {});
    point.simulate('mouseleave', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    const args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBeDefined();
    expect(args.datum).toBeDefined();
    expect(args.event).toBeDefined();
    expect(args.color).toBeDefined();
    expect(args.index).toBe(0);
  });
});
