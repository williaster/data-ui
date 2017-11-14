import React from 'react';
import PropTypes from 'prop-types';

import GlyphDot from '@vx/glyph/build/glyphs/Dot';
import LinePath from '@vx/shape/build/shapes/LinePath';
import color from '@data-ui/theme/build/color';

import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import interpolatorLookup from '../utils/interpolatorLookup';
import { interpolationShape, lineSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: lineSeriesDataShape.isRequired,
  disableMouseEvents: PropTypes.bool,
  interpolation: interpolationShape,
  showPoints: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,

  // these will likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  disableMouseEvents: false,
  interpolation: 'monotoneX',
  showPoints: false,
  stroke: color.default,
  strokeDasharray: null,
  strokeWidth: 3,
  strokeLinecap: 'round',
  xScale: null,
  yScale: null,
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
};

const x = d => d.x;
const y = d => d.y;
const defined = d => isDefined(y(d));
const noEventsStyles = { pointerEvents: 'none' };

export default class LineSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      interpolation,
      showPoints,
      stroke,
      strokeDasharray,
      strokeWidth,
      strokeLinecap,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;
    const strokeValue = callOrValue(stroke);
    const curve = interpolatorLookup[interpolation] || interpolatorLookup.monotoneX;
    return (
      <LinePath
        style={disableMouseEvents ? noEventsStyles : null}
        data={data}
        xScale={xScale}
        yScale={yScale}
        x={x}
        y={y}
        stroke={strokeValue}
        strokeWidth={callOrValue(strokeWidth)}
        strokeDasharray={callOrValue(strokeDasharray)}
        strokeLinecap={strokeLinecap}
        curve={curve}
        defined={defined}
        onClick={disableMouseEvents ? null : onClick && (() => (event) => {
          const d = findClosestDatum({ data, getX: x, event, xScale });
          onClick({ event, data, datum: d, color: strokeValue });
        })}
        onMouseMove={disableMouseEvents ? null : onMouseMove && (() => (event) => {
          const d = findClosestDatum({ data, getX: x, event, xScale });
          onMouseMove({ event, data, datum: d, color: strokeValue });
        })}
        onMouseLeave={disableMouseEvents ? null : onMouseLeave && (() => onMouseLeave)}
        glyph={showPoints && ((d, i) => (
          isDefined(x(d)) && isDefined(y(d)) &&
            <GlyphDot
              key={`${i}-${x(d)}`}
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
