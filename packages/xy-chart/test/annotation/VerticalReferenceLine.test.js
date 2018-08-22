import React from 'react';
import { shallow } from 'enzyme';
import { Line } from '@vx/shape';
import { Text } from '@vx/text';

import { XYChart, VerticalReferenceLine } from '../../src';

describe('<VerticalReferenceLine />', () => {
  const reference = 5;

  const mockProps = {
    xScale: { type: 'linear', domain: [0, 10] },
    yScale: { type: 'linear', domain: [0, 10] },
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    ariaLabel: 'label',
  };

  it('should be defined', () => {
    expect(VerticalReferenceLine).toBeDefined();
  });

  it('should render null if no accessors or scales are passed', () => {
    expect(shallow(<VerticalReferenceLine reference={reference} />).type()).toBeNull();
  });

  it('should render a Line', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine reference={reference} />
      </XYChart>,
    )
      .find(VerticalReferenceLine)
      .dive();

    expect(wrapper.find(Line)).toHaveLength(1);
  });

  it('the Line should span the entire height of the chart', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine reference={reference} />
      </XYChart>,
    )
      .find(VerticalReferenceLine)
      .dive();

    const line = wrapper.find(Line);
    expect(line.prop('from').y).toBe(mockProps.height);
    expect(line.prop('to').y).toBe(0);
  });

  it('should render a line at the passed reference number', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine reference={reference} />
      </XYChart>,
    ).find(VerticalReferenceLine);

    const xScale = wrapper.prop('xScale');
    const scaledValue = xScale(reference);
    const line = wrapper.dive().find(Line);
    expect(line.prop('from').x).toBe(scaledValue);
    expect(line.prop('to').x).toBe(scaledValue);
  });

  it('should render a Text label if label is specified', () => {
    const label = 'label!';

    const noLabelWrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine reference={reference} />
      </XYChart>,
    )
      .find(VerticalReferenceLine)
      .dive();

    const withLabelWrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine reference={reference} label={label} />
      </XYChart>,
    )
      .find(VerticalReferenceLine)
      .dive();

    expect(noLabelWrapper.find(Text)).toHaveLength(0);
    expect(withLabelWrapper.find(Text)).toHaveLength(1);
    const text = withLabelWrapper
      .find(Text)
      .dive()
      .find('svg')
      .find('text');

    expect(text.text()).toBe(label);
  });

  it('should use labelProps if passed', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <VerticalReferenceLine
          reference={reference}
          label="label!"
          labelProps={{
            id: 'test',
          }}
        />
      </XYChart>,
    )
      .find(VerticalReferenceLine)
      .dive();

    const text = wrapper.find(Text);
    expect(text.prop('id')).toBe('test');
  });
});
