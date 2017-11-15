import React from 'react';
import { shallow } from 'enzyme';
import { ViolinPlot } from '@vx/stats';

import { XYChart, ViolinPlotSeries, computeStats } from '../src/';

describe('<ViolinPlotSeries />', () => {
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
    expect(ViolinPlotSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<ViolinPlotSeries label="" data={[]} />).type()).toBeNull();
  });

  test('it should render only one boxplot', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <ViolinPlotSeries label="l2" data={[{ x: 'label1', binData: mockStats.binData }]} />
      </XYChart>,
    );
    expect(wrapper.find(ViolinPlotSeries).length).toBe(1);
    expect(wrapper.find(ViolinPlotSeries).first().dive().find(ViolinPlot).length).toBe(1);
  });
});
