/* eslint react/prop-types: 0 */
import React from 'react';

export default function RectComponent({
  key,
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
      key={key}
      x={x - rectSize / 2}
      y={y - rectSize / 2}
      width={rectSize}
      height={rectSize}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      onMouseMove={onMouseMove && ((event) => {
        onMouseMove({ event, data, datum, color: fill });
      })}
      onMouseLeave={onMouseLeave}
    />
  );
}
