import React from 'react';
import { GlyphDot } from '@vx/glyph';
import PropTypes from 'prop-types';

import { pointSeriesDataShape } from '../utils/propShapes';


export const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  fillOpacity: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.string,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  data: pointSeriesDataShape.isRequired,
  datum: PropTypes.object.isRequired,
};

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

GlyphDotComponent.propTypes = propTypes;
GlyphDotComponent.defaultProps = defaultPropTypes;
