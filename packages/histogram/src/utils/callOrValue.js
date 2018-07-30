export default function callOrValue(maybeFn, ...args) {
  if (typeof maybeFn === 'function') {
    return maybeFn(...args);
  }

  return maybeFn;
}
