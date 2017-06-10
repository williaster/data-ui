import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from '@vx/shape';

const DEFAULT_LINK_COLOR = '#ddd';

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string,
};

const defaultProps = {
  fill: DEFAULT_LINK_COLOR,
};

function Link({
  x,
  y,
  width,
  height,
  fill,
}) {
  return (
    <Bar
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      fillOpacity={0.9}
      rx={2}
      ry={2}
      stroke="#fff"
      strokeWidth={2}
      vectorEffect="non-scaling-stroke"
    />
  );
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
