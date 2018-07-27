import React from 'react';
import { shallow, mount } from 'enzyme';
import Stack from '@vx/shape/build/shapes/Stack';

import { XYChart, StackedAreaSeries } from '../../src';

describe('<StackedAreaSeries />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear' },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { x: new Date('2017-01-05'), y: 5, a: 1, b: 2, c: 3 },
    { x: new Date('2018-01-05'), y: 15, a: 10, b: 2, c: 3 },
    { x: new Date('2019-01-05'), y: 5, a: 4, b: 2, c: 0 },
  ];

  const mockStackKeys = ['a', 'b', 'c'];
  const mockStackFills = ['#fill1', '#fill2', '#fill3'];

  it('it should be defined', () => {
    expect(StackedAreaSeries).toBeDefined();
  });

  it('it should not render without x- and y-scales', () => {
    expect(shallow(<StackedAreaSeries data={[]} stackKeys={[]} />).type()).toBeNull();
  });

  it('it should render a <Stack />', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <StackedAreaSeries data={mockData} stackKeys={mockStackKeys} />
      </XYChart>,
    );

    const series = wrapper.find(StackedAreaSeries).dive();

    expect(series.find(Stack)).toHaveLength(1);
  });

  it('it should render an path for each stackKey', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <StackedAreaSeries data={mockData} stackKeys={mockStackKeys} />
      </XYChart>,
    );

    const series = wrapper.find(StackedAreaSeries).dive();
    const stack = series.find(Stack).dive();

    expect(stack.find('path')).toHaveLength(mockStackKeys.length);
  });

  it('it should call onMouseMove({ datum, data, event, color, seriesKey }), onMouseLeave(), and onClick({ datum, data, event, color, seriesKey }) on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = mount(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <StackedAreaSeries data={mockData} stackKeys={mockStackKeys} stackFills={mockStackFills} />
      </XYChart>,
    );

    const series = wrapper.find(StackedAreaSeries);
    const stack = series.find(Stack);
    const path = stack.find('path').first();

    path.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(mockData);
    expect(args.datum).toBe(mockData[0]);
    expect(args.event).toBeDefined();
    expect(mockStackFills.indexOf(args.color)).toBeGreaterThan(-1);
    expect(mockStackKeys.indexOf(args.seriesKey)).toBeGreaterThan(-1);

    path.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    path.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0]; // eslint-disable-line prefer-destructuring
    expect(args.data).toBe(mockData);
    expect(args.datum).toBe(mockData[0]);
    expect(args.event).toBeDefined();
    expect(mockStackFills.indexOf(args.color)).toBeGreaterThan(-1);
    expect(mockStackKeys.indexOf(args.seriesKey)).toBeGreaterThan(-1);
  });

  it('it should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = mount(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <StackedAreaSeries
          data={mockData}
          stackKeys={mockStackKeys}
          stackFills={mockStackFills}
          disableMouseEvents
        />
      </XYChart>,
    );

    const series = wrapper.find(StackedAreaSeries);
    const stack = series.find(Stack);
    const path = stack.find('path').first();

    path.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(0);

    path.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(0);

    path.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
