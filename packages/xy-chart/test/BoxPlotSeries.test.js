import React from 'react';
import { shallow } from 'enzyme';
import { BoxPlot } from '@vx/stats';

import { XYChart, BoxPlotSeries, computeStats } from '../src/';

describe('<BoxPlotSeries />', () => {
  const mockProps = {
    xScale: { type: 'band', paddingInner: 0.15, paddingOuter: 0.3 },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [1, 2, 3, 4, 5, 5, 5, 5, 5, 6, 9, 5, 1];
  const mockStats = computeStats(mockData);


  test('it should be defined', () => {
    expect(BoxPlotSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<BoxPlotSeries label="" data={[]} />).type()).toBeNull();
  });

  test('it should render only one boxplot', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BoxPlotSeries label="l2" data={[{ x: 'label1', ...mockStats.boxPlot }]} />
      </XYChart>,
    );
    expect(wrapper.find(BoxPlotSeries).length).toBe(1);
    expect(wrapper.find(BoxPlotSeries).first().dive().find(BoxPlot).length).toBe(1);
  });
});
