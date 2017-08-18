import React from 'react';
import { shallow } from 'enzyme';
import Line from '@vx/shape/build/shapes/Line';

import { Label, Sparkline, VerticalReferenceLine } from '../../src/';

describe('<VerticalReferenceLine />', () => {
  const sparklineProps = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10).fill().map((_, i) => i),
  };

  test('it should be defined', () => {
    expect(VerticalReferenceLine).toBeDefined();
  });

  test('it should render null if no accessors or scales are passed', () => {
    expect(shallow(<VerticalReferenceLine />)).toBeNull();
  });

  test('it should render a Line', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <VerticalReferenceLine />
      </Sparkline>,
    ).find(VerticalReferenceLine).dive();

    expect(wrapper.find(Line).length).toBe(1);
  });

  test('the Line should span the entire height of the chart', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <VerticalReferenceLine />
      </Sparkline>,
    ).find(VerticalReferenceLine).dive();

    const line = wrapper.find(Line);
    expect(line.prop('from').y).toBe(0);
    expect(line.prop('to').y).toBe(sparklineProps.height);
  });

  test('it should render a line if reference is mean, median, min, max', () => {
    const dataIndices = [0, 9, 0, 9]; // data indices of first, last, min, max
    ['first', 'last', 'min', 'max'].forEach((reference, i) => {
      const wrapper = shallow(
        <Sparkline {...sparklineProps}>
          <VerticalReferenceLine reference={reference} />
        </Sparkline>,
      ).find(VerticalReferenceLine);

      const xScale = wrapper.prop('xScale');
      const datumIndex = dataIndices[i];
      const datum = sparklineProps.data[datumIndex];
      const scaledValue = xScale(datum);

      const line = wrapper.dive().find(Line);
      expect(line.prop('from').x).toBe(scaledValue);
      expect(line.prop('to').x).toBe(scaledValue);
    });
  });

  test('it should render a line if reference is a number', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <VerticalReferenceLine reference={7} />
      </Sparkline>,
    ).find(VerticalReferenceLine);

    const xScale = wrapper.prop('xScale');
    const scaledValue = xScale(7);
    const line = wrapper.dive().find(Line);
    expect(line.prop('from').x).toBe(scaledValue);
    expect(line.prop('to').x).toBe(scaledValue);
  });

  test('it should render a label if returned by renderLabel', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <VerticalReferenceLine renderLabel={() => 'test'} />
      </Sparkline>,
    ).find(VerticalReferenceLine).dive();

    const label = wrapper.find(Label);
    expect(label.length).toBe(1);
    expect(label.dive().text()).toBe('test');
  });

  test('it should used the passed LabelComponent for the labels', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <VerticalReferenceLine
          renderLabel={() => 'test'}
          LabelComponent={<text className="test-label" />}
        />
      </Sparkline>,
    ).find(VerticalReferenceLine).dive();

    expect(wrapper.find('.test-label').length).toBe(1);
  });
});
