import React from 'react';

import { callOrValue, componentName } from '../../src/utils/chartUtils';

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
