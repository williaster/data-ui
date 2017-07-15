// Detect and traverse through HOCs to return the wrapped component
export function componentFromHOC(component = {}) {
  // Check if our name is a HOC name:
  const name = component.displayName || component.name || 'Component';
  if (name.includes('(')) {
    if (component.WrappedComponent) {
      return componentFromHOC(component.WrappedComponent);
    }
    // eslint-disable-next-line no-console
    console.warn(
      `HOC found for component ${name} but no "WrappedComponent" found on the component class.`,
    );
  }

  return component;
}

export function componentFromHOCInstance(instance) {
  return componentFromHOC(instance.type);
}
