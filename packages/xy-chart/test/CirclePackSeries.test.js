import React from 'react';
import { shallow, mount } from 'enzyme';

import { XYChart, CirclePackSeries, PointSeries } from '../src/';

describe('<PointSeries />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { x: new Date('2017-01-05 00:00:00'), importance: 0, size: 1 },
    { x: new Date('2017-01-05 01:00:00'), importance: 1, size: 3 },
    { x: new Date('2017-01-05 02:00:00'), importance: 5, size: 5 },
  ];

  test('it should be defined', () => {
    expect(CirclePackSeries).toBeDefined();
  });

  test('it should render a PointSeries', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <CirclePackSeries label="" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    const circleSeries = wrapper.find(CirclePackSeries);
    expect(circleSeries.length).toBe(1);
    expect(circleSeries.dive().find(PointSeries).length).toBe(1);
  });

  test('it should call onMouseMove({ datum, data, event, color }) and onMouseLeave() on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(
      <XYChart {...mockProps} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <CirclePackSeries label="" data={mockData} fill="army-green" />
      </XYChart>,
    );

    const point = wrapper.find('circle').first();
    point.simulate('mousemove');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    const args = onMouseMove.mock.calls[0][0];
    expect(args.data).toMatchObject(mockData);
    expect(args.datum).toMatchObject(mockData[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('army-green');

    point.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
