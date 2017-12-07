import Bar from '@vx/shape/build/shapes/Bar';
import React from 'react';
import { shallow, mount } from 'enzyme';

import { XYChart, IntervalSeries } from '../../src/';

describe('<PointSeries />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear' },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { x0: new Date('2017-01-05'), x1: new Date('2017-01-07') },
    { x0: new Date('2017-01-10'), x1: new Date('2017-01-15') },
    { x0: new Date('2017-01-20'), x1: new Date('2017-01-26') },
  ];

  test('it should be defined', () => {
    expect(IntervalSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<IntervalSeries data={[]} />).type()).toBeNull();
  });

  test('it should render a Bar for each datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <IntervalSeries data={mockData} />
      </XYChart>,
    );
    expect(wrapper.find(IntervalSeries).length).toBe(1);
    expect(wrapper.find(IntervalSeries).dive().find(Bar).length).toBe(mockData.length);
  });

  test('it should call onMouseMove({ datum, data, event, color }), onMouseLeave(), and onClick({ datum, data, event, color }) on trigger', () => {
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
        <IntervalSeries data={mockData} fill="purple" />
      </XYChart>,
    );

    const bar = wrapper.find(Bar).first();

    bar.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(mockData);
    expect(args.datum).toBe(mockData[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('purple');

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    bar.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0];
    expect(args.data).toBe(mockData);
    expect(args.datum).toBe(mockData[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('purple');
  });

  test('it should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
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
        <IntervalSeries data={mockData} fill="purple" disableMouseEvents />
      </XYChart>,
    );

    const bar = wrapper.find(Bar).first();

    bar.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(0);

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(0);

    bar.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
