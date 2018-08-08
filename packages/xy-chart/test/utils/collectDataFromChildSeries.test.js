import React from 'react';

import { BarSeries, LineSeries, AreaDifferenceSeries, AreaSeries } from '../../src';
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

  it('should concatenate all data', () => {
    expect(collectDataFromChildSeries(children)).toEqual([...barData, ...lineData, ...barData]);
  });

  it('should ignore non-series children', () => {
    expect(
      collectDataFromChildSeries([
        <span key="span" data={barData} />,
        <div key="div" data={barData} />,
      ]),
    ).toEqual([]);
  });

  it('should collect data from AreaDifferenceSeries child series', () => {
    const data1 = [{ x: 'area1', y: 123 }];
    const data2 = [{ x: 'area2', y: 135 }];
    expect(
      collectDataFromChildSeries([
        <AreaDifferenceSeries key="threshold" {...dummyProps}>
          <AreaSeries data={data1} />
          <AreaSeries data={data2} />
        </AreaDifferenceSeries>,
      ]),
    ).toEqual([...data1, ...data2]);
  });
});
