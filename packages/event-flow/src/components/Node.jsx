import { css, StyleSheet } from 'aphrodite';
import { Bar } from '@vx/shape';
import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape } from '../propShapes';

export const DEFAULT_NODE_WIDTH = 7;

const styles = StyleSheet.create({
  group: {
    ':hover': {
      opacity: 0.4,
    },
  },
});

const propTypes = {
  node: nodeShape.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func,
};

const defaultProps = {
  width: DEFAULT_NODE_WIDTH,
  fill: 'magenta',
  onMouseOver: null,
  onMouseOut: null,
  onClick: null,
};


function Node({
  node,
  x,
  y,
  width,
  height,
  fill,
  onClick,
  onMouseOver,
  onMouseOut,
}) {
  return (
    <g
      className={css(styles.group)}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      data-node={node.id}
    >
      <Bar
        x={x}
        y={y}
        width={width}
        height={Math.max(1, height)}
        fill={fill}
        rx={2}
        ry={2}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

Node.propTypes = propTypes;
Node.defaultProps = defaultProps;

export default Node;
