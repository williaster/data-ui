import React from 'react';
import { shallow } from 'enzyme';
import Line from '@vx/shape/build/shapes/Line';

import { XYChart, HorizontalReferenceLine } from '../src/';

describe('<HorizontalReferenceLine />', () => {
  const reference = 12;

  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear', domain: [0, 10] },
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    ariaLabel: 'label',
  };

  test('it should be defined', () => {
    expect(HorizontalReferenceLine).toBeDefined();
  });

  test('it should render null if no accessors or scales are passed', () => {
    expect(shallow(<HorizontalReferenceLine reference={reference} />).type()).toBeNull();
  });

  test('it should render a Line', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <HorizontalReferenceLine reference={reference} />
      </XYChart>,
    ).find(HorizontalReferenceLine).dive();

    expect(wrapper.find(Line).length).toBe(1);
  });

  test('the Line should span the entire width of the chart', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <HorizontalReferenceLine reference={reference} />
      </XYChart>,
    ).find(HorizontalReferenceLine).dive();

    const line = wrapper.find(Line);
    expect(line.prop('from').x).toBe(0);
    expect(line.prop('to').x).toBe(mockProps.width);
  });

  test('it should render a line at the passed reference number', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <HorizontalReferenceLine reference={reference} />
      </XYChart>,
    ).find(HorizontalReferenceLine);

    const yScale = wrapper.prop('yScale');
    const scaledValue = yScale(reference);
    const line = wrapper.dive().find(Line);
    expect(line.prop('from').y).toBe(scaledValue);
    expect(line.prop('to').y).toBe(scaledValue);
  });
});
