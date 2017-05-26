import React from 'react';
import PropTypes from 'prop-types';

import { curveCardinal, curveLinear } from '@vx/curve';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { colors } from '../theme';
import { lineSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: lineSeriesDataShape.isRequired,
  interpolation: PropTypes.oneOf(['linear', 'cardinal']), // @todo add more
  label: PropTypes.string.isRequired,
  showPoints: PropTypes.bool,

  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // these will likely be injected by the parent chart
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

const defaultProps = {
  interpolation: 'cardinal',
  showPoints: false,
  stroke: colors.default,
  strokeDasharray: null,
  strokeWidth: 3,
};

const x = d => d.x;
const y = d => d.y;

export default function LineSeries({
  data,
  interpolation,
  label,
  showPoints,
  stroke,
  strokeDasharray,
  strokeWidth,
  xScale,
  yScale,
}) {
  return (
    <LinePath
      key={label}
      data={data}
      xScale={xScale}
      yScale={yScale}
      x={x}
      y={y}
      stroke={callOrValue(stroke)}
      strokeWidth={callOrValue(strokeWidth)}
      strokeDasharray={callOrValue(strokeDasharray)}
      curve={interpolation === 'linear' ? curveLinear : curveCardinal}
      glyph={showPoints && ((d, i) => (
        isDefined(y(d)) &&
          <GlyphDot
            key={`${label}-${i}-${x(d)}`}
            cx={xScale(x(d))}
            cy={yScale(y(d))}
            r={4}
            fill={d.stroke || callOrValue(stroke, d, i)}
            stroke="#FFFFFF"
            strokeWidth={1}
          >
            {d.label &&
              <text
                x={xScale(x(d))}
                y={yScale(y(d))}
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
