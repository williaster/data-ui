import Bar from '@vx/shape/build/shapes/Bar';
import React from 'react';
import { shallow } from 'enzyme';
import { FocusBlurHandler } from '@data-ui/shared';

import { XYChart, BarSeries } from '../../src/';

describe('<BarSeries />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear', includeZero: false },
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
    expect(BarSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<BarSeries data={[]} />).type()).toBeNull();
  });

  test('it should render one bar per datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    const barSeries = wrapper.find(BarSeries).dive();
    expect(barSeries.find(Bar).length).toBe(mockData.length);

    const noDataWrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries data={[]} />
      </XYChart>,
    );
    const noDataBarSeries = noDataWrapper.find(BarSeries).dive();
    expect(noDataBarSeries.find(Bar).length).toBe(0);
  });

  test('it should not render bars for null data', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries
          data={mockData.map((d, i) => ({
            x: d.date,
            y: i === 0 ? null : d.num,
          }))}
        />
      </XYChart>,
    );
    const barSeries = wrapper.find(BarSeries).dive();
    expect(barSeries.find(Bar).length).toBe(mockData.length - 1);
  });

  test('it should work with time or band scales', () => {
    const timeWrapper = shallow(
      <XYChart {...mockProps} xScale={{ type: 'time' }}>
        <BarSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    expect(timeWrapper.find(BarSeries).length).toBe(1);
    expect(timeWrapper.find(BarSeries).dive().find(Bar).length).toBe(mockData.length);

    const bandWrapper = shallow(
      <XYChart {...mockProps} xScale={{ type: 'band' }}>
        <BarSeries data={mockData.map(d => ({ ...d, x: d.cat, y: d.num }))} />
      </XYChart>,
    );
    expect(bandWrapper.find(BarSeries).length).toBe(1);
    expect(bandWrapper.find(BarSeries).dive().find(Bar).length).toBe(mockData.length);
  });

  test('it should call onMouseMove({ datum, data, event, color }), onMouseLeave(), and onClick({ datum, data, event, color }) on trigger', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <BarSeries fill="banana" data={data} />
      </XYChart>,
    );

    const bar = wrapper.find(BarSeries)
      .dive()
      .find(Bar)
      .first()
      .dive();

    bar.simulate('mousemove', ({ event: {} }));
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('banana');

    bar.simulate('mouseleave', ({ event: {} }));
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    bar.simulate('click', ({ event: {} }));
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('banana');
  });

  test('it should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <BarSeries data={data} disableMouseEvents />
      </XYChart>,
    );

    const bar = wrapper.find(BarSeries).dive().find(Bar).first();

    bar.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(0);

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(0);

    bar.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  test('it should render a FocusBlurHandler for each point', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));

    const wrapper = shallow(
      <XYChart {...mockProps}>
        <BarSeries data={data} />
      </XYChart>,
    );

    const bars = wrapper.find(BarSeries).dive();
    expect(bars.find(FocusBlurHandler)).toHaveLength(data.length);
  });

  test('it should invoke onMouseMove when focused', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseMove={onMouseMove}>
        <BarSeries data={data} />
      </XYChart>,
    );

    const firstPoint = wrapper.find(BarSeries).dive().find(FocusBlurHandler).first();
    firstPoint.simulate('focus');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });

  test('it should invoke onMouseLeave when blured', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseLeave={onMouseLeave}>
        <BarSeries data={data} />
      </XYChart>,
    );

    const firstPoint = wrapper.find(BarSeries).dive().find(FocusBlurHandler).first();
    firstPoint.simulate('blur');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
