import PropTypes from 'prop-types';
import React from 'react';

import PropValue from './ReactSourceView/PropValue';
import { componentFromHOC, componentFromHOCInstance } from '../util/componentFromHOC';
import { getAllProps, getPropType } from '../util/propTypeHelpers';
import { css, withStyles, withStylesPropTypes } from '../../themes/withStyles';

import codeStyles from './ReactSourceView/codeStyles';

const EM_DASH = '—';

const propTypes = {
  ...withStylesPropTypes,
  component: PropTypes.func,
  instance: PropTypes.element,
  isHOC: PropTypes.bool,
};

const defaultProps = {
  component: null,
  instance: null,
  isHOC: false,
};

function PropTable({ instance, component: HOCComponent, useHOC, styles }) {
  let component = HOCComponent || instance;
  if (HOCComponent && !useHOC) {
    component = componentFromHOC(HOCComponent);
  } else if (!useHOC) {
    component = componentFromHOCInstance(instance);
  }

  if (!component || !component.name) {
    return null;
  }

  const componentProps = getAllProps(component)
    .map(prop => getPropType(component, prop))
    .filter(Boolean);

  if (!componentProps.length) {
    return null;
  }

  // sort alphabetically
  componentProps.sort((a, b) => a.prop.toLowerCase() > b.prop.toLowerCase());

  return (
    <div {...css(styles.container)}>
      <div {...css(styles.title)}>
        <code>
          <span {...css(codeStyles.brace)}>{'<'}</span>
          <span {...css(codeStyles.component)}>{component.displayName || component.name}</span>
          <span {...css(codeStyles.brace)}>{' /> '}</span>
        </code>
      </div>
      <table {...css(styles.propTable)}>
        <thead>
          <tr>
            {['Prop Name', 'PropType', 'Default', 'Required'].map(val => (
              <th key={val} {...css(styles.border, styles.th)}>
                <div>{val}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {componentProps.map(row => (
            <tr key={row.prop}>
              <td {...css(styles.border)}>
                <div {...css(styles.small)}>{row.prop || EM_DASH}</div>
              </td>
              <td {...css(styles.border)}>
                <div {...css(styles.small)}>
                  {row.name || EM_DASH}
                  {row.typeChecker && (
                    <span> <PropValue val={row.typeChecker} withPropTypes /></span>
                  )}
                </div>
              </td>
              <td {...css(styles.border)}>
                <div {...css(styles.small)}>
                  {row.default === undefined ? EM_DASH : (
                    <PropValue val={row.default} />
                  )}
                </div>
              </td>
              <td {...css(styles.border)}>
                <div {...css(styles.small)}>{row.required ? 'Yes' : EM_DASH}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PropTable.propTypes = propTypes;
PropTable.defaultProps = defaultProps;

export default withStyles(({ unit, color, font }) => ({
  container: {
    background: color.grays[0],
    padding: 2 * unit,
    marginBottom: unit,
    borderBottom: `2px solid ${color.grays[1]}`,
  },

  title: {
    color: color.black,
    paddingLeft: 0.5 * unit,
    ...font.large,
    ...font.bold,
  },

  propTable: {
    borderSpacing: 0,
    borderCollapse: 'separate',
    width: '100%',
    margin: `${2 * unit}px 0`,
  },

  th: {
    textAlign: 'left',
    borderBottom: `1px solid ${color.lightGray}`,
    ...font.bold,
  },

  border: {
    padding: `${0.5 * unit}px ${1 * unit}px`,
    borderRight: `1px solid ${color.lightGray}`,
    ':last-child ': {
      borderRight: 'none',
    },
  },

  small: {
    ...font.regular,
  },
}))(PropTable);
