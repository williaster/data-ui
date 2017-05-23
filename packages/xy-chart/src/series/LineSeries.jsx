import React from 'react';
import PropTypes from 'prop-types';

import { curveCardinal, curveLinear } from '@vx/curve';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';

import { callOrValue } from '../utils/chartUtils';
import { scaleShape } from '../utils/propShapes';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    y: PropTypes.number.isRequired,
    label: PropTypes.string,
  })).isRequired,
  interpolation: PropTypes.oneOf(['linear', 'cardinal']), // @todo add more
  label: PropTypes.string.isRequired,
  showPoints: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // these will likely be injected by the parent chart
  scales: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }).isRequired,
};

const defaultProps = {
  interpolation: 'cardinal',
  showPoints: true,
  stroke: '#00A699',
  strokeDasharray: null,
  strokeWidth: 3,
};

export default function LineSeries({
  data,
  interpolation,
  label,
  showPoints,
  scales,
  stroke,
  strokeDasharray,
  strokeWidth,
}) {
  const { x, y } = scales;
  const xAccessor = x.accessor || (d => d.x);
  const yAccessor = y.accessor || (d => d.y);
  return (
    <LinePath
      key={label}
      data={data}
      xScale={x}
      yScale={y}
      x={xAccessor}
      y={yAccessor}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      curve={interpolation === 'linear' ? curveLinear : curveCardinal}
      glyph={showPoints && ((d, i) => (
        <GlyphDot
          key={`${label}-${i}-${xAccessor(d)}`}
          cx={x(d.x)}
          cy={y(d.y)}
          r={4}
          fill={d.stroke || callOrValue(stroke, d, i)}
          stroke="#FFFFFF"
          strokeWidth={1}
        >
          {d.label &&
            <text
              x={xAccessor(d.x)}
              y={yAccessor(d.y)}
              dx={10}
              fill={d.stroke || callOrValue(stroke, d, i)}
              stroke={'#fff'}
              strokeWidth={1}
              fontSize={12}
            >
              {d.label}
            </text>}
        </GlyphDot>
      ))}
    />
  );
}

LineSeries.propTypes = propTypes;
LineSeries.defaultProps = defaultProps;
LineSeries.displayName = 'LineSeries';
