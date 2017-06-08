import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from '@vx/shape';

import { linkShape } from '../propShapes';

const propTypes = {
  link: linkShape.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
};

const defaultProps = {};

function Link({
  link,
  xScale,
  yScale,
  x,
  y,
}) {
  const x0 = xScale(x(link.source));
  const x1 = xScale(x(link.target));
  const y0 = yScale(y(link.source));
  const y1 = yScale(y(link.target));
  return (
    <Bar
      x={Math.min(x0, x1)}
      y={Math.min(y0, y1)}
      fill="#bbb"
      width={Math.abs(x1 - x0) - 10}
      height={50}
      fillOpacity={0.5}
    />
  );
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;
