import React from 'react';
import { PointComponentPropTypes } from '@data-ui/xy-chart';

export default function RectComponent({
  x,
  y,
  size,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeDasharray,
  onMouseMove,
  onMouseLeave,
  data,
  datum,
}) {
  const rectSize = size * 1.414;

  return (
    <rect
      x={x - rectSize / 2}
      y={y - rectSize / 2}
      width={rectSize}
      height={rectSize}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      onMouseMove={
        onMouseMove &&
        (event => {
          onMouseMove({ event, data, datum, color: fill });
        })
      }
      onMouseLeave={onMouseLeave}
    />
  );
}

const defaultProps = {
  strokeDasharray: null,
  onMouseMove: null,
  onMouseLeave: null,
};

RectComponent.propTypes = PointComponentPropTypes;
RectComponent.defaultProps = defaultProps;
