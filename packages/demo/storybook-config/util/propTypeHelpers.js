/* eslint no-underscore-dangle: 0 */
import PropTypes from 'prop-types';

// hash the propType functions for lookup
const PropTypesLookup = new Map();

Object.keys(PropTypes).forEach((typeName) => {
  const type = PropTypes[typeName];
  PropTypesLookup.set(type, typeName);
  PropTypesLookup.set(type.isRequired, typeName);
});

const HOC_PROP_TYPES = { styles: true, theme: true };

// Returns an arry of all non-HOC props for a given component function
export function getAllProps(component) {
  return Object.keys({
    ...component.defaultProps,
    ...component.propTypes,
  }).filter(prop => !HOC_PROP_TYPES[prop]);
}

export function getPropType(component, prop) {
  if (!component.propTypes && !component.defaultProps) return null;
  if (!component.propTypes[prop] && !component.defaultProps[prop]) return null;

  const type = component.propTypes[prop];
  const defaultValue = component.defaultProps && component.defaultProps[prop];
  const required = type && (type.typeRequired || (type.isRequired === undefined));
  const propType = PropTypesLookup.get(type) || 'other';
  const typeChecker = type && type.typeChecker;

  return {
    prop,
    required,
    typeChecker,
    name: propType,
    default: defaultValue,
  };
}
