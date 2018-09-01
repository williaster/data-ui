import React from 'react';
import { shallow } from 'enzyme';
import { Line } from '@vx/shape';
import { scaleLinear } from '@vx/scale';

import { CrossHair } from '../../src';

describe('<CrossHair />', () => {
  const xScaleProp = scaleLinear({
    domain: [0, 100],
    range: [0, 100],
  });

  const yScaleProp = scaleLinear({
    domain: [0, 100],
    range: [100, 0],
  });

  const props = {
    datum: { x: 10, y: 33 },
    series: { seriesA: { x: 10, y: 33 }, seriesB: { x: 10, y: 1 }, seriesC: { x: 10, y: 99 } },
    xScale: xScaleProp,
    yScale: yScaleProp,
    getScaledX: d => xScaleProp(d.x),
    getScaledY: d => yScaleProp(d.y),
  };

  it('should be defined', () => {
    expect(CrossHair).toBeDefined();
  });

  it('should render a horizontal and vertical lines as specified', () => {
    const horiz = shallow(<CrossHair {...props} showHorizontalLine showVerticalLine={false} />);
    const vert = shallow(<CrossHair {...props} showHorizontalLine={false} showVerticalLine />);
    const both = shallow(<CrossHair {...props} showHorizontalLine showVerticalLine />);

    expect(horiz.find(Line)).toHaveLength(1);
    expect(vert.find(Line)).toHaveLength(1);
    expect(both.find(Line)).toHaveLength(2);
  });

  it('should render one or more circles depending on props', () => {
    const zero = shallow(<CrossHair {...props} showCircle={false} />);
    const one = shallow(<CrossHair {...props} showCircle />);
    const multi = shallow(<CrossHair {...props} showMultipleCircles />);

    const { series } = props;
    expect(zero.find('circle')).toHaveLength(0);
    expect(one.find('circle')).toHaveLength(1);
    expect(multi.find('circle')).toHaveLength(Object.keys(series).length);
  });

  it('should render a fullWidth line if specified', () => {
    const fullWidthWrapper = shallow(
      <CrossHair {...props} showHorizontalLine fullWidth showVerticalLine={false} />,
    );
    const { xScale, datum } = props;
    const fullWidthLine = fullWidthWrapper.find(Line).dive();
    expect(fullWidthLine.prop('x1')).toBe(Math.min(...xScale.range()));
    expect(fullWidthLine.prop('x2')).toBe(Math.max(...xScale.range()));

    const partialWidthWrapper = shallow(
      <CrossHair {...props} showHorizontalLine showVerticalLine={false} />,
    );

    const partialWidthLine = partialWidthWrapper.find(Line).dive();
    expect(partialWidthLine.prop('x1')).toBe(Math.min(...xScale.range()));
    expect(partialWidthLine.prop('x2')).toBe(datum.x);
  });

  it('should render a fullHeight line if specified', () => {
    const fullHeightWrapper = shallow(
      <CrossHair {...props} showVerticalLine fullHeight showHorizontalLine={false} />,
    );
    const { yScale, datum } = props;
    const fullHeightLine = fullHeightWrapper.find(Line).dive();
    expect(fullHeightLine.prop('y1')).toBe(Math.max(...yScale.range()));
    expect(fullHeightLine.prop('y2')).toBe(Math.min(...yScale.range()));

    const partialHeightWrapper = shallow(
      <CrossHair {...props} showVerticalLine showHorizontalLine={false} />,
    );

    const partialHeightLine = partialHeightWrapper.find(Line).dive();
    expect(partialHeightLine.prop('y1')).toBe(Math.max(...yScale.range()));
    expect(partialHeightLine.prop('y2')).toBe(yScale(datum.y));
  });
});
