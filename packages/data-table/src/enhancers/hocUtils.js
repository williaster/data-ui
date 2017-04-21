/* eslint-disable no-param-reassign */
import React from 'react';

export function baseHOC(pureComponent) {
  if (pureComponent) {
    if (!React.PureComponent) {
      throw new ReferenceError('baseHOC() pureComponent option requires React 15.3.0 or later');
    }
    return React.PureComponent;
  }
  return React.Component;
}

export function updateDisplayName(WrappedComponent, EnhancedComponent, hocName) {
  const wrappedComponentName = WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component';

  EnhancedComponent.WrappedComponent = WrappedComponent;
  EnhancedComponent.displayName = `${hocName}(${wrappedComponentName})`;
}
