import React from 'react';

import { BarSeries, LineSeries } from '../../src';
import collectDataFromChildSeries from '../../src/utils/collectDataFromChildSeries';

describe('collectDataFromChildSeries', () => {
  const dummyProps = { xScale: () => {}, yScale: () => {}, barWidth: 0 };
  const barData = [{ x: 'bar', y: 123 }];
  const lineData = [{ x: 'line', y: 123 }];

  const children = [
    <div />,
    <BarSeries data={barData} {...dummyProps} />,
    <LineSeries data={lineData} {...dummyProps} />,
    <BarSeries data={barData} {...dummyProps} />,
    null,
  ];

  test('should ignore non-series children', () => {
    expect(
      collectDataFromChildSeries([<span data={[]} />, <div />]).allData,
    ).toEqual([]);
  });

  const output = collectDataFromChildSeries(children);

  test('should concatenate all data', () => {
    expect(output.allData).toEqual([...barData, ...lineData, ...barData]);
  });

  test('should collect data by Series type', () => {
    expect(output.dataBySeriesType).toEqual({
      BarSeries: [...barData, ...barData],
      LineSeries: [...lineData],
    });
  });

  test('should collect data by child index', () => {
    expect(output.dataByIndex).toEqual({
      1: barData,
      2: lineData,
      3: barData,
    });
  });
});
