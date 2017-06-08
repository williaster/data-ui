import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';

import { nodeShape } from '../propShapes';

const propTypes = {
  node: nodeShape.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  fillScale: PropTypes.func.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  fill: PropTypes.func.isRequired,
  label: PropTypes.node,
};

const defaultProps = {
  label: null,
};

function Node({
  node,
  xScale,
  yScale,
  fillScale,
  x,
  y,
  fill,
  label,
}) {
  const width = 15;
  const height = 50;
  return (
    <Group
      top={yScale(y(node))}
      left={xScale(x(node))}
    >
      <Bar
        x={0}
        y={0}
        fill={fillScale(fill(node))}
        width={width}
        height={height}
        ry={4}
      />
      {label}
    </Group>
  );
}

Node.propTypes = propTypes;
Node.defaultProps = defaultProps;

export default Node;
