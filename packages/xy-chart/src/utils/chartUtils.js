import { Children } from 'react';

export function callOrValue(maybeFn, ...args) {
  if (typeof maybeFn === 'function') {
    return maybeFn(args);
  }
  return maybeFn;
}

export function componentName(component) {
  if (component && component.type) {
    return component.type.displayName || component.type.name || 'Component';
  }
  return '';
}

export function getChildWithName(name, children) {
  const ChildOfInterest = Children.toArray(children).filter(c => componentName(c) === name);
  return ChildOfInterest.length ? ChildOfInterest[0] : null;
}
