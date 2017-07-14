import PropTypes from 'prop-types';
import React from 'react';

import { css } from '../../../themes/withStyles';
import codeStyles from './codeStyles';
import PropValue from './PropValue';

const propTypes = {
  node: PropTypes.node.isRequired,
  singleLine: PropTypes.bool,
};
const defaultProps = {
  singleLine: false,
};

export default function Props({ node, singleLine }) {
  const { props } = node;
  const { defaultProps: nodeDefaultProps } = node.type;

  if (!props || typeof props !== 'object') {
    return null;
  }

  // Filter out names that we don't show inline:
  const names = Object.keys(props).filter(name => (
    name.charAt(0) !== '_' &&
    name !== 'children' &&
    (!nodeDefaultProps || props[name] !== nodeDefaultProps[name])
  ));

  const breakIntoNewLines = names.length > 1;
  const endingSpace = singleLine ? ' ' : '';

  const items = [];
  names.forEach((name, i) => {
    items.push(
      <span key={name}>
        {breakIntoNewLines ? (
          <span>
            <br />&nbsp;&nbsp;
          </span>
        ) : ' '}
        <span {...css(codeStyles.prop)}>{name}</span>
        {(!props[name] || typeof props[name] !== 'boolean') && (
          <span>
            =
            <span><PropValue val={props[name]} braceWrap /></span>
          </span>
        )}

        {i === (names.length - 1) && (
          breakIntoNewLines ? <br /> : endingSpace
        )}
      </span>,
    );
  });

  return <span>{items}</span>;
}

Props.propTypes = propTypes;
Props.defaultProps = defaultProps;
