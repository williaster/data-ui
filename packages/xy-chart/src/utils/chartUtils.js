import { Children } from 'react';
import { scaleLinear, scaleTime, scaleBand, scaleOrdinal } from '@vx/scale';
import { extent } from 'd3-array';

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
  return name.match(/axis/gi);
}

export function isBarSeries(name) {
  return name.match(/Bar/g);
}

export function isCrossHair(name) {
  return name.match(/crosshair/gi);
}

export function isSeries(name) {
  return name.match(/series/gi);
}

export function isStackedSeries(name) {
  return name.match(/stacked/gi);
}

export const scaleTypeToScale = {
  time: scaleTime,
  linear: scaleLinear,
  band: scaleBand,
  ordinal: scaleOrdinal,
};

export function collectDataFromChildSeries(children) {
  let allData = [];
  const dataByIndex = {};
  const dataBySeriesType = {};
  Children.forEach(children, (Child, i) => {
    if (Child && Child.props && Child.props.data) {
      const name = componentName(Child);
      const { data } = Child.props;
      if (data && isSeries(name)) {
        dataByIndex[i] = data;
        allData = allData.concat(data);
        dataBySeriesType[name] = (dataBySeriesType[name] || []).concat(data);
      }
    }
  });
  return { dataByIndex, allData, dataBySeriesType };
}

export function getScaleForAccessor({
  allData,
  accessor,
  type,
  includeZero = true,
  range,
  ...rest
}) {
  let domain;
  if (type === 'band' || type === 'ordinal') {
    domain = allData.map(accessor);
  }
  if (type === 'linear' || type === 'time') {
    const [min, max] = extent(allData, accessor);
    domain = [
      type === 'linear' && includeZero ? Math.min(0, min) : min,
      type === 'linear' && includeZero ? Math.max(0, max) : max,
    ];
  }
  return scaleTypeToScale[type]({ domain, range, ...rest });
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
