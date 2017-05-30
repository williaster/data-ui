import { BarStack } from '@vx/shape';
import React from 'react';
import { shallow } from 'enzyme';
import { XYChart, StackedBarSeries } from '../src/';

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

  const mockStackKeys = ['a', 'b', 'c'];

  test('it should be defined', () => {
    expect(StackedBarSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<StackedBarSeries stackKeys={[]} data={[]} />).type()).toBeNull();
  });

  test('it should render a BarGroup', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <StackedBarSeries stackKeys={mockStackKeys} data={mockData} />
      </XYChart>,
    );
    const series = wrapper.find(StackedBarSeries).dive();
    expect(series.find(BarStack).length).toBe(1);
  });

  test('it should render one rect per x value per stack key', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <StackedBarSeries
          stackKeys={mockStackKeys}
          data={mockData}
        />
      </XYChart>,
    );
    const rects = wrapper.render().find('rect');
    expect(rects.length).toBe(mockStackKeys.length * mockData.length);
  });

  test('it should use stackFills for color', () => {
    const fills = ['magenta', 'maplesyrup', 'banana'];
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <StackedBarSeries
          stackKeys={['a', 'b', 'c']}
          stackFills={fills}
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
