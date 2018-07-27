import React from 'react';

import { BarSeries, LineSeries } from '../../src';
import collectDataFromChildSeries from '../../src/utils/collectDataFromChildSeries';

describe('collectDataFromChildSeries', () => {
  const dummyProps = { xScale: () => {}, yScale: () => {}, barWidth: 0 };
  const barData = [{ x: 'bar', y: 123 }];
  const lineData = [{ x: 'line', y: 123 }];

  const children = [
    <div key="div" />,
    <BarSeries key="bar1" data={barData} {...dummyProps} />,
    <LineSeries key="line1" data={lineData} {...dummyProps} />,
    <BarSeries key="bar2" data={barData} {...dummyProps} />,
    null,
  ];

  it('should ignore non-series children', () => {
    expect(
      collectDataFromChildSeries([<span key="span" data={[]} />, <div key="div" />]).allData,
    ).toEqual([]);
  });

  const output = collectDataFromChildSeries(children);

  it('should concatenate all data', () => {
    expect(output.allData).toEqual([...barData, ...lineData, ...barData]);
  });

  it('should collect data by Series type', () => {
    expect(output.dataBySeriesType).toEqual({
      BarSeries: [...barData, ...barData],
      LineSeries: [...lineData],
    });
  });

  it('should collect data by child index', () => {
    expect(output.dataByIndex).toEqual({
      1: barData,
      2: lineData,
      3: barData,
    });
  });
});
