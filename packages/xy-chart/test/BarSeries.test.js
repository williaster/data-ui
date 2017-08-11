import { Bar } from '@vx/shape';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { XYChart, BarSeries } from '../src/';

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
    expect(shallow(<BarSeries label="" data={[]} />).type()).toBeNull();
  });

  test('it should render one bar per datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries label="l" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    const barSeries = wrapper.find(BarSeries).dive();
    expect(barSeries.find(Bar).length).toBe(mockData.length);

    const noDataWrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries label="l" data={[]} />
      </XYChart>,
    );
    const noDataBarSeries = noDataWrapper.find(BarSeries).dive();
    expect(noDataBarSeries.find(Bar).length).toBe(0);
  });

  test('it should not render bars for null data', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BarSeries
          label="l"
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
        <BarSeries label="l" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    expect(timeWrapper.find(BarSeries).length).toBe(1);
    expect(timeWrapper.find(BarSeries).dive().find(Bar).length).toBe(mockData.length);

    const bandWrapper = shallow(
      <XYChart {...mockProps} xScale={{ type: 'band' }}>
        <BarSeries label="l" data={mockData.map(d => ({ ...d, x: d.cat, y: d.num }))} />
      </XYChart>,
    );
    expect(bandWrapper.find(BarSeries).length).toBe(1);
    expect(bandWrapper.find(BarSeries).dive().find(Bar).length).toBe(mockData.length);
  });

  test('it should call onMouseMove({ datum, data, event, color }) and onMouseLeave() on trigger', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(
      <XYChart {...mockProps} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <BarSeries fill="banana" label="l" data={data} />
      </XYChart>,
    );

    const bar = wrapper.find(Bar).first();
    bar.simulate('mousemove');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    const args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('banana');

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
