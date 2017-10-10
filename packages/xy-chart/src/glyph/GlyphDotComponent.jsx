import React from 'react';
import { GlyphDot } from '@vx/glyph';

import { pointComponentPropTypes } from '../series/PointSeries';

const defaultPropTypes = {
  onMouseMove: null,
  onMouseLeave: null,
  strokeDasharray: null,
};

export default function GlyphDotComponent({
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
  return (
    <GlyphDot
      cx={x}
      cy={y}
      r={size}
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

GlyphDotComponent.propTypes = pointComponentPropTypes;
GlyphDotComponent.defaultProps = defaultPropTypes;
