import React from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';

import { color } from '@data-ui/theme';
import { Group } from '@vx/group';
import { Line } from '@vx/shape';

import { callOrValue, isDefined } from '../utils/chartUtils';

const propTypes = {
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  circleSize: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  circleFill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleStroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  circleStyles: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  ]),
  lineStyles: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  showCircle: PropTypes.bool,
  showMultipleCircles: PropTypes.bool,
  showHorizontalLine: PropTypes.bool,
  showVerticalLine: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely injected by parent
  datum: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  series: PropTypes.objectOf(PropTypes.object),
  getScaledX: PropTypes.func,
  getScaledY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  circleSize: 4,
  circleFill: color.grays[7],
  circleStroke: '#ffffff',
  circleStyles: {
    pointerEvents: 'none',
  },
  datum: {},
  getScaledX: null,
  getScaledY: null,
  lineStyles: {
    pointerEvents: 'none',
  },
  fullHeight: false,
  fullWidth: false,
  series: {},
  showCircle: true,
  showMultipleCircles: false,
  showHorizontalLine: true,
  showVerticalLine: true,
  stroke: color.grays[7],
  strokeDasharray: '3,3',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function CrossHair({
  circleFill,
  circleSize,
  circleStroke,
  circleStyles,
  datum,
  getScaledX,
  getScaledY,
  fullHeight,
  fullWidth,
  lineStyles,
  series,
  showHorizontalLine,
  showCircle,
  showMultipleCircles,
  showVerticalLine,
  stroke,
  strokeDasharray,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getScaledX || !getScaledY) return null;
  const [xMin, xMax] = extent(xScale.range());
  const [yMin, yMax] = extent(yScale.range());

  const circleData =
    showMultipleCircles && Object.keys(series).length > 0
      ? Object.keys(series).map(seriesKey => ({ seriesKey, ...series[seriesKey] }))
      : [datum];

  const circlePositions = circleData.map(d => ({ x: getScaledX(d), y: getScaledY(d) }));

  return (
    <Group>
      {showHorizontalLine &&
        !showMultipleCircles &&
        isDefined(circlePositions[0].y) && (
          <Line
            from={{ x: xMin, y: circlePositions[0].y }}
            to={{ x: fullWidth ? xMax : circlePositions[0].x, y: circlePositions[0].y }}
            style={lineStyles}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeWidth={strokeWidth}
          />
        )}
      {showVerticalLine &&
        isDefined(circlePositions[0].x) && (
          <Line
            from={{ x: circlePositions[0].x, y: yMax }}
            to={{ x: circlePositions[0].x, y: fullHeight ? yMin : circlePositions[0].y }}
            style={lineStyles}
            stroke={stroke}
            strokeDasharray={strokeDasharray}
            strokeWidth={strokeWidth}
          />
        )}

      {(showCircle || showMultipleCircles) &&
        circleData.map((d, i) => {
          const { x, y } = circlePositions[i];

          return (
            isDefined(x) &&
            isDefined(y) && (
              <circle
                key={`circle-${d.seriesKey || i}`}
                cx={x}
                cy={y}
                r={callOrValue(circleSize, d, i)}
                fill={callOrValue(circleFill, d, i)}
                strokeWidth={1}
                stroke={callOrValue(circleStroke, d, i)}
                style={callOrValue(circleStyles, d, i)}
              />
            )
          );
        })}
    </Group>
  );
}

CrossHair.propTypes = propTypes;
CrossHair.defaultProps = defaultProps;
CrossHair.displayName = 'CrossHair';

export default CrossHair;
