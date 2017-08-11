import React from 'react';
import { BarSeries, LineSeries } from '../src';

import {
  callOrValue,
  getScaleForAccessor,
  collectDataFromChildSeries,
  componentName,
} from '../src/utils/chartUtils';

describe('collectDataFromChildSeries', () => {
  const dummyProps = { xScale: () => {}, yScale: () => {}, label: 'bogus', barWidth: 0 };
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

describe('callOrValue', () => {
  test('should return non-functions', () => {
    expect(callOrValue(123)).toEqual(123);
    expect(callOrValue('123')).toEqual('123');
    expect(callOrValue(['hello'])).toEqual(['hello']);
  });

  test('should call a function', () => {
    expect(callOrValue(() => 'abc')).toEqual('abc');
  });

  test('should pass args to functions', () => {
    expect(callOrValue((a, b, c) => `${a}${b}${c}`, 'x', 'y')).toEqual('xyundefined');
  });
});

describe('getScaleForAccessor', () => {
  const allData = [
    { date: '2016-01-05', dirtyNum: undefined, num: 124, cat: 'a' },
    { date: '2017-01-05', dirtyNum: -15, num: 500, cat: 'b' },
    { date: '2018-01-05', dirtyNum: 7, num: 50, cat: 'c' },
    { date: '2019-01-05', dirtyNum: null, num: 501, cat: 'z' },
  ];

  test('should compute date domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => new Date(d.date),
      maxAccessor: d => new Date(d.date),
      type: 'time',
      range: [0, 100],
    }).domain()).toEqual([
      new Date(allData[0].date),
      new Date(allData[allData.length - 1].date),
    ]);
  });

  test('should compute date strings domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.date,
      maxAccessor: d => d.date,
      type: 'band',
      range: [0, 100],
    }).domain()).toEqual(['2016-01-05', '2017-01-05', '2018-01-05', '2019-01-05']);
  });

  test('should compute categorical domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.cat,
      maxAccessor: d => d.cat,
      type: 'band',
      range: [0, 100],
    }).domain()).toEqual(['a', 'b', 'c', 'z']);
  });

  test('should compute numeric domains including zero', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.num,
      maxAccessor: d => d.num,
      type: 'linear',
      range: [0, 100],
    }).domain()).toEqual([0, 501]);
  });

  test('should compute numeric domains excluding zero', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.num,
      maxAccessor: d => d.num,
      type: 'linear',
      range: [0, 100],
      includeZero: false,
    }).domain()).toEqual([50, 501]);
  });

  test('should compute numeric domains with missing values', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.dirtyNum,
      maxAccessor: d => d.dirtyNum,
      type: 'linear',
      range: [0, 100],
      includeZero: false,
    }).domain()).toEqual([-15, 7]);
  });
});

describe('componentName', () => {
  class Component extends React.Component {} // eslint-disable-line
  function SFC() {}
  function SFCWithDisplayName() {}
  SFCWithDisplayName.displayName = 'SFCWithDisplayName';

  test('should work with React Components', () => {
    expect(componentName(<Component />)).toBe('Component');
  });

  test('should work with SFCs', () => {
    expect(componentName(<SFC />)).toBe('SFC');
  });

  test('should work with DisplayName', () => {
    expect(componentName(<SFCWithDisplayName />)).toBe('SFCWithDisplayName');
  });

  test('should return empty string for non-components', () => {
    expect(componentName(null)).toBe('');
    expect(componentName(SFC)).toBe('');
  });
});
