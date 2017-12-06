import React from 'react';

import {
  callOrValue,
  componentName,
} from '../../src/utils/chartUtils';

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
