import React from 'react';

import {
  BarSeries,
  LineSeries,
  PointSeries,
  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,
} from '../../src';

import { componentName, isBandLine, isReferenceLine, isSeries } from '../../src/utils/componentIsX';

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

describe('isReferenceLine', () => {
  test('it should be defined', () => {
    expect(isReferenceLine).toBeDefined();
  });

  test('it should return true for HorizontalReferenceLine and VerticalReferenceLine', () => {
    expect(isReferenceLine(componentName(<HorizontalReferenceLine />))).toBe(true);
    expect(isReferenceLine(componentName(<VerticalReferenceLine />))).toBe(true);
  });

  test('it should return negative for non-reference-line components', () => {
    expect(isReferenceLine(componentName(<BandLine />))).toBe(false);
    expect(isReferenceLine(componentName(<LineSeries />))).toBe(false);
  });
});

describe('isBandLine', () => {
  test('it should be defined', () => {
    expect(isBandLine).toBeDefined();
  });

  test('it should return true for HorizontalReferenceLine and VerticalReferenceLine', () => {
    expect(isBandLine(componentName(<BandLine />))).toBe(true);
  });

  test('it should return negative for non-band-line components', () => {
    expect(isBandLine(componentName(<VerticalReferenceLine />))).toBe(false);
    expect(isBandLine(componentName(<LineSeries />))).toBe(false);
  });
});
