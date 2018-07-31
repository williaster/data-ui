export function componentName(component) {
  if (component && component.type) {
    return component.type.displayName || component.type.name || 'Component';
  }

  return '';
}

export function isSeries(name) {
  return /series/gi.test(name);
}

export function isReferenceLine(name) {
  return /referenceline/gi.test(name);
}

export function isBandLine(name) {
  return /bandline/gi.test(name);
}
