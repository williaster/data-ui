import React from 'react';
import { shallow } from 'enzyme';

import Line from '@vx/shape/build/shapes/Line';
import scaleLinear from '@vx/scale/build/scales/linear';

import CrossHair from '../src/chart/CrossHair';

describe('<CrossHair />', () => {
  const props = {
    top: 20,
    left: 70,
    xScale: scaleLinear({
      domain: [0, 100],
      range: [0, 100],
    }),
    yScale: scaleLinear({
      domain: [0, 100],
      range: [100, 0],
    }),
  };

  test('it should be defined', () => {
    expect(CrossHair).toBeDefined();
  });

  test('it should render a horizontal line, vertical line, and a circle depending on props', () => {
    let wrapper = shallow(
      <CrossHair {...props} showHorizontalLine showVerticalLine showCircle />,
    );

    expect(wrapper.find(Line).length).toBe(2);
    expect(wrapper.find('circle').length).toBe(1);

    wrapper = shallow(
      <CrossHair {...props} showHorizontalLine showVerticalLine={false} />,
    );

    expect(wrapper.find(Line).length).toBe(1);
    expect(wrapper.find('circle').length).toBe(1);

    wrapper = shallow(
      <CrossHair {...props} showHorizontalLine={false} showVerticalLine showCircle={false} />,
    );

    expect(wrapper.find(Line).length).toBe(1);
    expect(wrapper.find('circle').length).toBe(0);

    wrapper = shallow(
      <CrossHair {...props} showHorizontalLine={false} showVerticalLine={false} />,
    );
    expect(wrapper.find(Line).length).toBe(0);
  });

  test('it should render a fullWidth line if specified', () => {
    const fullWidthWrapper = shallow(
      <CrossHair {...props} showHorizontalLine fullWidth showVerticalLine={false} />,
    );

    const fullWidthLine = fullWidthWrapper.find(Line).dive();
    expect(fullWidthLine.prop('x1')).toBe(Math.min(...props.xScale.range()));
    expect(fullWidthLine.prop('x2')).toBe(Math.max(...props.xScale.range()));

    const partialWidthWrapper = shallow(
      <CrossHair {...props} showHorizontalLine showVerticalLine={false} />,
    );

    const partialWidthLine = partialWidthWrapper.find(Line).dive();
    expect(partialWidthLine.prop('x1')).toBe(Math.min(...props.xScale.range()));
    expect(partialWidthLine.prop('x2')).toBe(props.left);
  });

  test('it should render a fullHeight line if specified', () => {
    const fullHeightWrapper = shallow(
      <CrossHair {...props} showVerticalLine fullHeight showHorizontalLine={false} />,
    );

    const fullHeightLine = fullHeightWrapper.find(Line).dive();
    expect(fullHeightLine.prop('y1')).toBe(Math.max(...props.yScale.range()));
    expect(fullHeightLine.prop('y2')).toBe(Math.min(...props.yScale.range()));

    const partialHeightWrapper = shallow(
      <CrossHair {...props} showVerticalLine showHorizontalLine={false} />,
    );

    const partialHeightLine = partialHeightWrapper.find(Line).dive();
    expect(partialHeightLine.prop('y1')).toBe(Math.max(...props.yScale.range()));
    expect(partialHeightLine.prop('y2')).toBe(props.top);
  });
});
