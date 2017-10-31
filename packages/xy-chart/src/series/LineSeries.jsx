import React from 'react';
import PropTypes from 'prop-types';

import { curveCardinal, curveLinear } from '@vx/curve';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';
import { color } from '@data-ui/theme';

import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import { interpolationShape, lineSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: lineSeriesDataShape.isRequired,
  interpolation: interpolationShape,
  label: PropTypes.string.isRequired,
  showPoints: PropTypes.bool,

  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),

  // these will likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  interpolation: 'monotoneX',
  showPoints: false,
  stroke: color.default,
  strokeDasharray: null,
  strokeWidth: 3,
  strokeLinecap: 'round',
  xScale: null,
  yScale: null,
  onMouseMove: undefined,
  onMouseLeave: undefined,
};

const x = d => d.x;
const y = d => d.y;
const defined = d => isDefined(y(d));

export default class LineSeries extends React.PureComponent {
  render() {
    const {
      data,
      interpolation,
      label,
      showPoints,
      stroke,
      strokeDasharray,
      strokeWidth,
      strokeLinecap,
      xScale,
      yScale,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;
    const strokeValue = callOrValue(stroke);
    return (
      <LinePath
        key={label}
        data={data}
        xScale={xScale}
        yScale={yScale}
        x={x}
        y={y}
        stroke={strokeValue}
        strokeWidth={callOrValue(strokeWidth)}
        strokeDasharray={callOrValue(strokeDasharray)}
        strokeLinecap={strokeLinecap}
        curve={interpolation === 'linear' ? curveLinear : curveCardinal}
        defined={defined}
        onMouseMove={onMouseMove && (() => (event) => {
          const d = findClosestDatum({ data, getX: x, event, xScale });
          onMouseMove({ event, data, datum: d, color: strokeValue });
        })}
        onMouseLeave={onMouseLeave && (() => onMouseLeave)}
        glyph={showPoints && ((d, i) => (
          isDefined(x(d)) && isDefined(y(d)) &&
            <GlyphDot
              key={`${label}-${i}-${x(d)}`}
              cx={xScale(x(d))}
              cy={yScale(y(d))}
              r={4}
              fill={d.stroke || callOrValue(stroke, d, i)}
              stroke="#FFFFFF"
              strokeWidth={1}
              style={{ pointerEvents: 'none' }}
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
}

LineSeries.propTypes = propTypes;
LineSeries.defaultProps = defaultProps;
LineSeries.displayName = 'LineSeries';
