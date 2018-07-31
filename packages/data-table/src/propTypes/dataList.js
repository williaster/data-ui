import { List } from 'immutable';

function dataListPropType(props, propName, componentName) {
  // eslint-disable-next-line react/destructuring-assignment
  if (!List.isList(props[propName])) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected Immutable.List.`,
    );
  }

  return null;
}

dataListPropType.isRequired = (props, propName, componentName) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (!props[propName]) {
    return new Error(`Invalid prop \`${propName}\` was not specified in \`${componentName}\``);
  }

  return dataListPropType(props, propName, componentName);
};

export default dataListPropType;
