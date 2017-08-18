import React from 'react';

import {
  BarSeries,
  LineSeries,
  PointSeries,
  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,
} from '../../src';
import { componentName, isLine, isSeries } from '../../src/utils/componentIsX';

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

describe('isLine', () => {
  test('it should be defined', () => {
    expect(isLine).toBeDefined();
  });

  test('it should return true for HorizontalReferenceLine, VerticalReferenceLine, and BandLine', () => {
    expect(isLine(componentName(<HorizontalReferenceLine />))).toBe(true);
    expect(isLine(componentName(<VerticalReferenceLine />))).toBe(true);
    expect(isLine(componentName(<BandLine />))).toBe(true);
  });
});

describe('isSeries', () => {
  test('it should be defined', () => {
    expect(isSeries).toBeDefined();
  });

  test('it should return true for BarSeries, LineSeries, and PointSeries', () => {
    expect(isSeries(componentName(<BarSeries />))).toBe(true);
    expect(isSeries(componentName(<LineSeries />))).toBe(true);
    expect(isSeries(componentName(<PointSeries />))).toBe(true);
  });
});
