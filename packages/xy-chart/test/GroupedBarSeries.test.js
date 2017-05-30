import { BarGroup } from '@vx/shape';
import React from 'react';
import { shallow } from 'enzyme';
import { XYChart, GroupedBarSeries } from '../src/';

describe('<GroupedBarSeries />', () => {
  const mockProps = {
    xScale: { type: 'band' },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { x: '2017-01-05', a: 1, b: 2, c: 3, y: 6 },
    { x: '2018-01-05', a: 7, b: 7, c: 7, y: 21 },
    { x: '2019-01-05', a: 5, b: 3, c: 1, y: 9 },
  ];

  const mockGroupKeys = ['a', 'b', 'c'];

  test('it should be defined', () => {
    expect(GroupedBarSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<GroupedBarSeries groupKeys={[]} data={[]} />).type()).toBeNull();
  });

  test('it should render a BarGroup', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries groupKeys={mockGroupKeys} data={mockData} />
      </XYChart>,
    );
    const series = wrapper.find(GroupedBarSeries).dive();
    expect(series.find(BarGroup).length).toBe(1);
  });

  test('it should render one rect per x value per group key', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries
          groupKeys={mockGroupKeys}
          data={mockData}
        />
      </XYChart>,
    );
    const rects = wrapper.render().find('rect');
    expect(rects.length).toBe(mockGroupKeys.length * mockData.length);
  });

  test('it should use groupFills for color', () => {
    const fills = ['magenta', 'maplesyrup', 'banana'];
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <GroupedBarSeries
          groupKeys={['a', 'b', 'c']}
          groupFills={fills}
          data={mockData}
        />
      </XYChart>,
    );
    const rects = wrapper.render().find('rect');
    rects.each((i, rect) => {
      const fill = rect.attribs.fill;
      expect(fills.some(f => f === fill)).toBe(true);
    });
  });
});
