import React from 'react';
import { shallow } from 'enzyme';
import Line from '@vx/shape/build/shapes/Line';

import { Label, Sparkline, HorizontalReferenceLine } from '../../src';

describe('<HorizontalReferenceLine />', () => {
  const constantValue = 12;
  const sparklineProps = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10).fill(constantValue), // this makes mean/median/max/min easy
  };

  it('should be defined', () => {
    expect(HorizontalReferenceLine).toBeDefined();
  });

  it('should render null if no accessors or scales are passed', () => {
    expect(shallow(<HorizontalReferenceLine />).type()).toBeNull();
  });

  it('should render a Line', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <HorizontalReferenceLine />
      </Sparkline>,
    )
      .find(HorizontalReferenceLine)
      .dive();

    expect(wrapper.find(Line)).toHaveLength(1);
  });

  it('should render a Line that spans the entire width of the chart', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <HorizontalReferenceLine />
      </Sparkline>,
    )
      .find(HorizontalReferenceLine)
      .dive();

    const line = wrapper.find(Line);
    expect(line.prop('from').x).toBe(0);
    expect(line.prop('to').x).toBe(sparklineProps.width);
  });

  it('should render a line if reference is mean, median, min, max', () => {
    ['mean', 'median', 'min', 'max'].forEach(reference => {
      const wrapper = shallow(
        <Sparkline {...sparklineProps}>
          <HorizontalReferenceLine reference={reference} />
        </Sparkline>,
      ).find(HorizontalReferenceLine);

      const yScale = wrapper.prop('yScale');
      const scaledValue = yScale(constantValue);
      const line = wrapper.dive().find(Line);
      expect(line.prop('from').y).toBe(scaledValue);
      expect(line.prop('to').y).toBe(scaledValue);
    });
  });

  it('should render a line if reference is a number', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <HorizontalReferenceLine reference={constantValue} />
      </Sparkline>,
    ).find(HorizontalReferenceLine);

    const yScale = wrapper.prop('yScale');
    const scaledValue = yScale(constantValue);
    const line = wrapper.dive().find(Line);
    expect(line.prop('from').y).toBe(scaledValue);
    expect(line.prop('to').y).toBe(scaledValue);
  });

  it('should render a label if returned by renderLabel', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <HorizontalReferenceLine renderLabel={() => 'test'} />
      </Sparkline>,
    )
      .find(HorizontalReferenceLine)
      .dive();

    const label = wrapper.find(Label);
    expect(label).toHaveLength(1);
    expect(label.dive().text()).toBe('test');
  });

  it('should used the passed LabelComponent for the labels', () => {
    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <HorizontalReferenceLine
          renderLabel={() => 'test'}
          LabelComponent={<text className="test-label" />}
        />
      </Sparkline>,
    )
      .find(HorizontalReferenceLine)
      .dive();

    expect(wrapper.find('.test-label')).toHaveLength(1);
  });
});
