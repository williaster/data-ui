import React from 'react';
import { scaleLinear, scaleBand } from '@vx/scale';

import {
  callOrValue,
  componentName,
  scaleInvert,
  getDomainFromExtent,
} from '../../src/utils/chartUtils';

describe('callOrValue', () => {
  it('should return non-functions', () => {
    expect(callOrValue(123)).toEqual(123);
    expect(callOrValue('123')).toEqual('123');
    expect(callOrValue(['hello'])).toEqual(['hello']);
  });

  it('should call a function', () => {
    expect(callOrValue(() => 'abc')).toEqual('abc');
  });

  it('should pass args to functions', () => {
    expect(callOrValue((a, b, c) => `${a}${b}${c}`, 'x', 'y')).toEqual('xyundefined');
  });
});

describe('componentName', () => {
  class Component extends React.Component {} // eslint-disable-line
  function SFC() {}
  function SFCWithDisplayName() {}
  SFCWithDisplayName.displayName = 'SFCWithDisplayName';

  it('should work with React Components', () => {
    expect(componentName(<Component />)).toBe('Component');
  });

  it('should work with SFCs', () => {
    expect(componentName(<SFC />)).toBe('SFC');
  });

  it('should work with DisplayName', () => {
    expect(componentName(<SFCWithDisplayName />)).toBe('SFCWithDisplayName');
  });

  it('should return empty string for non-components', () => {
    expect(componentName(null)).toBe('');
    expect(componentName(SFC)).toBe('');
  });
});

describe('scaleInvert', () => {
  it('should work correct with non-band or no-ordinal Scale', () => {
    const linearScale = scaleLinear({
      range: [0, 1000],
      domain: [0, 100],
    });
    expect(linearScale.invert(10)).toEqual(scaleInvert(linearScale, 10));
  });

  it('should work correct with band or ordinal Scales', () => {
    const domain = [1, 2, 3, 4, 5];
    const bandScale = scaleBand({
      rangeRound: [0, 100],
      domain,
    });
    expect(scaleInvert(bandScale, 30)).toEqual(1);
    expect(scaleInvert(bandScale, 90)).toEqual(4);
  });
});

describe('getDomainFromExtent', () => {
  it('should work correct with non-band or no-ordinal Scale', () => {
    const linearScale = scaleLinear({
      range: [0, 1000],
      domain: [0, 100],
    });
    const delta = 2;
    const start = 10;
    const end = 20;
    const domain = getDomainFromExtent(linearScale, start, end, delta);
    expect(domain.start).toEqual(linearScale.invert(start - 2));
    expect(domain.end).toEqual(linearScale.invert(end + 2));
  });

  it('should work correct with band or ordinal Scales', () => {
    const domain = ['test1', 'test5', 'test3', 'test3', 'test4'];
    const bandScale = scaleBand({
      rangeRound: [0, 100],
      domain,
    });
    const delta = 2;
    const start = 10;
    const end = 30;
    const selectedDomain = getDomainFromExtent(bandScale, start, end, delta);
    expect(selectedDomain.values).toHaveLength(2);
    expect(selectedDomain.values[0]).toEqual('test1');
    expect(selectedDomain.values[1]).toEqual('test5');
  });
});
