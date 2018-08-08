import React from 'react';

import { BarSeries, LineSeries, AreaDifferenceSeries, AreaSeries } from '../../src';
import collectVoronoiData from '../../src/utils/collectVoronoiData';

describe('interpolatorLookup', () => {
  const dummyProps = { xScale: () => {}, yScale: () => {}, barWidth: 0 };
  const barData = [{ x: 'bar', y: 123 }];
  const lineData = [{ x: 'line', y: 123 }];
  const nullData = [{ x: null, y: 1 }, { x: 'test', y: null }];

  const getX = d => d.x;
  const getY = d => d.y;

  const children = [
    <div key="div" data={barData} />,
    <BarSeries key="bar" data={barData} {...dummyProps} />,
    <LineSeries key="line" data={lineData} {...dummyProps} />,
    <BarSeries key="bar2" data={barData} {...dummyProps} disableMouseEvents />,
    null,
  ];

  it('should be defined', () => {
    expect(collectVoronoiData).toBeDefined();
  });

  it('should return an array', () => {
    expect(collectVoronoiData({ children, getX, getY })).toEqual(expect.any(Array));
  });

  it('should not include datum from <*Series /> with disableMouseEvents set to true', () => {
    expect(
      collectVoronoiData({
        children: [
          <BarSeries key="bar" data={barData} {...dummyProps} />,
          <LineSeries key="line" data={lineData} {...dummyProps} />,
          <BarSeries key="bar2" data={barData} {...dummyProps} disableMouseEvents />,
        ],
        getX,
        getY,
      }),
    ).toHaveLength(2);
  });

  it('should not include datum from non-<*Series /> children', () => {
    expect(
      collectVoronoiData({
        children: [<div key="div" />, <BarSeries key="bar" data={barData} {...dummyProps} />, null],
        getX,
        getY,
      }),
    ).toHaveLength(1);
  });

  it('should not include datum with undefined x or y values', () => {
    expect(
      collectVoronoiData({
        children: [
          <BarSeries key="bar" data={nullData} {...dummyProps} />,
          <LineSeries key="line" data={nullData} {...dummyProps} />,
          <BarSeries key="bar2" data={nullData} {...dummyProps} />,
        ],
        getX,
        getY,
      }),
    ).toHaveLength(0);
  });

  it('should collect data from AreaDifferenceSeries child series', () => {
    expect(
      collectVoronoiData({
        children: [
          <AreaDifferenceSeries key="area-difference" {...dummyProps}>
            <AreaSeries data={lineData} />
            <AreaSeries data={lineData} />
          </AreaDifferenceSeries>,
        ],
        getX,
        getY,
      }),
    ).toEqual([...lineData, ...lineData]);
  });
});
