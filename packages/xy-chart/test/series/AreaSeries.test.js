import React from 'react';
import { shallow, mount } from 'enzyme';
import { Area, LinePath } from '@vx/shape';
import { FocusBlurHandler } from '@data-ui/shared';

import { XYChart, AreaSeries } from '../../src';

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

  it('should be defined', () => {
    expect(AreaSeries).toBeDefined();
  });

  it('should not render without x- and y-scales', () => {
    expect(shallow(<AreaSeries data={[]} />).type()).toBeNull();
  });

  it('should render an Area for each AreaSeries', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <AreaSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
        <AreaSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    expect(wrapper.find(AreaSeries)).toHaveLength(2);
    expect(
      wrapper
        .find(AreaSeries)
        .first()
        .dive()
        .find(Area),
    ).toHaveLength(1);
  });

  it('should render a LinePath', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const wrapperWithLine = shallow(
      <XYChart {...mockProps}>
        <AreaSeries data={data} strokeWidth={3} />
      </XYChart>,
    );
    const areaSeriesWithLinePath = wrapperWithLine.find(AreaSeries).dive();
    expect(areaSeriesWithLinePath.find(LinePath)).toHaveLength(1);
  });

  it('should call onMouseMove({ datum, data, event, color }), onMouseLeave(), and onClick({ datum, data, event, color }) on trigger', () => {
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
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('hot-pink');

    area.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    area.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0]; // eslint-disable-line prefer-destructuring
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('hot-pink');
  });

  it('should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
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

  it('should render a FocusBlurHandler for each point', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));

    const wrapper = mount(
      <XYChart {...mockProps}>
        <AreaSeries data={data} fill="hot-pink" />
      </XYChart>,
    );

    const area = wrapper.find(AreaSeries);
    expect(area.find(FocusBlurHandler)).toHaveLength(data.length);
  });

  it('should invoke onMouseMove when focused', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();

    const wrapper = mount(
      <XYChart {...mockProps} onMouseMove={onMouseMove}>
        <AreaSeries data={data} fill="hot-pink" />
      </XYChart>,
    );

    const firstPoint = wrapper
      .find(AreaSeries)
      .find(FocusBlurHandler)
      .first();
    firstPoint.simulate('focus');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });

  it('should invoke onMouseLeave when blured', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseLeave = jest.fn();

    const wrapper = mount(
      <XYChart {...mockProps} onMouseLeave={onMouseLeave}>
        <AreaSeries data={data} fill="hot-pink" />
      </XYChart>,
    );

    const firstPoint = wrapper
      .find(AreaSeries)
      .find(FocusBlurHandler)
      .first();
    firstPoint.simulate('blur');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
