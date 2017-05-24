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

export function nonBandBarWidth({ children, totalWidth }) {
  let barWidth = Infinity;
  Children.forEach(children, (Child) => {
    if (componentName(Child).match(/Bar/g)) {
      const data = Child.props.data;
      barWidth = Math.min(barWidth, (totalWidth / data.length) - 6);
    }
  });
  return barWidth === Infinity ? 0 : Math.max(0, barWidth);
}

export function isBarSeries(name) {
  return name.match(/Bar/g);
}
