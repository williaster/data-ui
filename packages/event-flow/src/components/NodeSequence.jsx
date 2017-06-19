import { css, StyleSheet } from 'aphrodite';
import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape, scaleShape } from '../propShapes';

const styles = StyleSheet.create({
  container: {
    fontFamily: 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif',
  },

  separator: {
    color: '#484848',
    fontSize: 14,
  },

  node: {
    fontSize: 15,
    fontWeight: 200,
  },

  currNode: {
    fontWeight: 700,
    textDecoration: 'underline',
    textDecorationColor: '#484848',
  },
});

const propTypes = {
  nodeArray: PropTypes.arrayOf(nodeShape),
  currNodeIndex: PropTypes.number,
  separator: PropTypes.node,
  colorScale: scaleShape.isRequired,
  maxNameLength: PropTypes.number,
};

const defaultProps = {
  nodeArray: [],
  currNodeIndex: -1,
  separator: ' > ',
  maxNameLength: 10,
};

function NodeSequence({
  nodeArray,
  currNodeIndex,
  separator,
  colorScale,
  maxNameLength,
}) {
  return nodeArray.length ? (
    <div className={css(styles.container)}>
      {nodeArray.map((node, index) => (
        <span key={node.id}>
          {index !== 0 &&
            <span className={css(styles.separator)}>
              {separator}
            </span>}
          <span
            className={css(styles.node, index === currNodeIndex && styles.currNode)}
            style={{ color: colorScale.scale(colorScale.accessor(node)) }}
          >
            {node.name.length > maxNameLength ?
              `${node.slice(maxNameLength + 1).toUpperCase()}…` : node.toUpperCase()}
          </span>
        </span>
      ))}
    </div>
  ) : null;
}

NodeSequence.propTypes = propTypes;
NodeSequence.defaultProps = defaultProps;

export default NodeSequence;
