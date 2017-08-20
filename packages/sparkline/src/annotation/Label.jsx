import PropTypes from 'prop-types';
import React from 'react';

import color from '@data-ui/theme/build/color';

export const propTypes = {
  anchor: PropTypes.oneOf(['start', 'middle', 'end']),
  dominantBaseline: PropTypes.string,
  dx: PropTypes.number,
  dy: PropTypes.number,
  fill: PropTypes.string,
  label: PropTypes.node,
  paintOrder: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

export const defaultProps = {
  anchor: 'middle',
  dominantBaseline: 'middle',
  dx: 0,
  dy: 0,
  fill: color.text,
  label: null,
  paintOrder: 'stroke',
  stroke: '#fff',
  strokeWidth: 2,
  x: 0,
  y: 0,
};

function Label({
  anchor,
  dominantBaseline,
  dx,
  dy,
  fill,
  label,
  paintOrder,
  stroke,
  strokeWidth,
  x,
  y,
  ...rest
}) {
  return (
    <text
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      fill={fill}
      dominantBaseline={dominantBaseline}
      paintOrder={paintOrder}
      stroke={stroke}
      strokeWidth={strokeWidth}
      textAnchor={anchor}
      {...rest}
    >
      {label}
    </text>
  );
}

Label.propTypes = propTypes;
Label.defaultProps = defaultProps;
Label.displayName = 'Label';

export default Label;
