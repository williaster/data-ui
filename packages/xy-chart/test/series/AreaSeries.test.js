import React from 'react';
import { shallow, mount } from 'enzyme';
import Area from '@vx/shape/build/shapes/Area';
import LinePath from '@vx/shape/build/shapes/LinePath';

import { XYChart, AreaSeries } from '../../src/';

describe('<AreaSeries />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear' },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { date: new Date('2017-01-05'), cat: 'a', num: 15 },
    { date: new Date('2018-01-05'), cat: 'b', num: 51 },
    { date: new Date('2019-01-05'), cat: 'c', num: 377 },
  ];

  test('it should be defined', () => {
    expect(AreaSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<AreaSeries data={[]} />).type()).toBeNull();
  });

  test('it should render an Area for each AreaSeries', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <AreaSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
        <AreaSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    expect(wrapper.find(AreaSeries).length).toBe(2);
    expect(wrapper.find(AreaSeries).first().dive().find(Area).length).toBe(1);
  });

  test('it should render a LinePath if strokeWidth is non-zero', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const wrapperWithLine = shallow(
      <XYChart {...mockProps} >
        <AreaSeries data={data} strokeWidth={3} />
      </XYChart>,
    );
    const areaSeriesWithLinePath = wrapperWithLine.find(AreaSeries).dive();
    expect(areaSeriesWithLinePath.find(LinePath).length).toBe(1);

    const wrapperNoLine = shallow(
      <XYChart {...mockProps} >
        <AreaSeries data={data} strokeWidth={0} />
      </XYChart>,
    );

    const areaSeriesNoLinePath = wrapperNoLine.find(AreaSeries).dive();
    expect(areaSeriesNoLinePath.find(LinePath).length).toBe(0);
  });

  test('it should call onMouseMove({ datum, data, event, color }), onMouseLeave(), and onClick({ datum, data, event, color }) on trigger', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
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
        <AreaSeries data={data} fill="hot-pink" />
      </XYChart>,
    );

    const area = wrapper.find(AreaSeries);

    area.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBeNull(); // @TODO depends on mocking out findClosestDatum
    expect(args.event).toBeDefined();
    expect(args.color).toBe('hot-pink');

    area.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    area.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBeNull(); // @TODO depends on mocking out findClosestDatum
    expect(args.event).toBeDefined();
    expect(args.color).toBe('hot-pink');
  });

  test('it should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
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
        <AreaSeries disableMouseEvents data={data} fill="hot-pink" />
      </XYChart>,
    );

    const area = wrapper.find(AreaSeries);

    area.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(0);

    area.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(0);

    area.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
