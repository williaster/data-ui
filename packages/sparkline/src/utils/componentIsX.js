export function componentName(component) {
  if (component && component.type) {
    return component.type.displayName || component.type.name || 'Component';
  }
  return '';
}

export function isSeries(name) {
  return name.match(/series/gi);
}

export function isLine(name) {
  return name.match(/line/gi);
}
