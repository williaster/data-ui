import React from 'react';

import { BarSeries, LineSeries } from '../../src';
import collectVoronoiData from '../../src/utils/collectVoronoiData';

describe('interpolatorLookup', () => {
  const dummyProps = { xScale: () => {}, yScale: () => {}, barWidth: 0 };
  const barData = [{ x: 'bar', y: 123 }];
  const lineData = [{ x: 'line', y: 123 }];
  const nullData = [{ x: null, y: 1 }, { x: 'test', y: null }];

  const getX = d => d.x;
  const getY = d => d.y;

  const children = [
    <div data={barData} />,
    <BarSeries data={barData} {...dummyProps} />,
    <LineSeries data={lineData} {...dummyProps} />,
    <BarSeries data={barData} {...dummyProps} disableMouseEvents />,
    null,
  ];

  test('it should be defined', () => {
    expect(collectVoronoiData).toBeDefined();
  });

  test('it should return an array', () => {
    expect(collectVoronoiData({ children, getX, getY })).toEqual(expect.any(Array));
  });

  test('it should not include datum from <*Series /> with disableMouseEvents set to true', () => {
    expect(collectVoronoiData({
      children: [
        <BarSeries data={barData} {...dummyProps} />,
        <LineSeries data={lineData} {...dummyProps} />,
        <BarSeries data={barData} {...dummyProps} disableMouseEvents />,
      ],
      getX,
      getY,
    }).length).toBe(2);
  });

  test('it should not include datum from non-<*Series /> children', () => {
    expect(collectVoronoiData({
      children: [
        <div />,
        <BarSeries data={barData} {...dummyProps} />,
        null,
      ],
      getX,
      getY,
    }).length).toBe(1);
  });

  test('it should not include datum with undefined x or y values', () => {
    expect(collectVoronoiData({
      children: [
        <BarSeries data={nullData} {...dummyProps} />,
        <LineSeries data={nullData} {...dummyProps} />,
        <BarSeries data={nullData} {...dummyProps} />,
      ],
      getX,
      getY,
    }).length).toBe(0);
  });
});
