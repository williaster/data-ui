/* eslint no-magic-numbers: 'off' */
import { Children } from 'react';

export function callOrValue(maybeFn, ...args) {
  if (typeof maybeFn === 'function') {
    return maybeFn(...args);
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

export function isDefined(val) {
  return typeof val !== 'undefined' && val !== null;
}

export function isAxis(name) {
  return /axis/gi.test(name);
}

export function isBarSeries(name) {
  return /bar/gi.test(name);
}

export function isBrush(name) {
  return name === 'Brush';
}

export function isCirclePackSeries(name) {
  return name === 'CirclePackSeries';
}

export function isCrossHair(name) {
  return /crosshair/gi.test(name);
}

export function isReferenceLine(name) {
  return /reference/gi.test(name);
}

export function isSeries(name) {
  return /series/gi.test(name);
}

export function isStackedSeries(name) {
  return /stacked/gi.test(name);
}

export function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (height <= 600) return 5;

  return 8;
}

export function numTicksForWidth(width) {
  if (width <= 300) return 3;
  if (width <= 400) return 5;

  return 10;
}

export function propOrFallback(props, propName, fallback) {
  return props && isDefined(props[propName]) ? props[propName] : fallback;
}

export function scaleInvert(scale, value) {
  if (!scale.invert) {
    const leftEdges = scale.range();
    let i = 0;
    const width = scale(scale.domain()[1]) - scale(scale.domain()[0]);
    if (width > 0) {
      while (value > leftEdges[0] + width * (i + 1)) {
        i += 1;
      }
    } else {
      while (value < leftEdges[0] + width * (i + 1)) {
        i += 1;
      }
    }

    return i;
  }

  return scale.invert(value);
}

export const DEFAULT_CHART_MARGIN = {
  top: 64,
  right: 64,
  bottom: 64,
  left: 64,
};
