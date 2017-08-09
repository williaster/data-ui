import React from 'react';
import PropTypes from 'prop-types';

import { color } from '@data-ui/theme';
import { Group } from '@vx/group';
import { Line } from '@vx/shape';

const propTypes = {
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  circleSize: PropTypes.number,
  circleFill: PropTypes.string,
  circleStroke: PropTypes.string,
  circleStyles: PropTypes.object,
  lineStyles: PropTypes.object,
  showCircle: PropTypes.bool,
  showHorizontalLine: PropTypes.bool,
  showVerticalLine: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely injected by parent
  left: PropTypes.number,
  top: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,

};

const defaultProps = {
  left: null,
  top: null,
  circleSize: 4,
  circleFill: color.grays[7],
  circleStroke: '#ffffff',
  circleStyles: {
    pointerEvents: 'none',
  },
  lineStyles: {
    pointerEvents: 'none',
  },
  fullHeight: false,
  fullWidth: false,
  showCircle: true,
  showHorizontalLine: true,
  showVerticalLine: true,
  stroke: color.grays[7],
  strokeDasharray: '3,3',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function CrossHair({
  left,
  top,
  circleFill,
  circleSize,
  circleStroke,
  circleStyles,
  fullHeight,
  fullWidth,
  showHorizontalLine,
  showCircle,
  showVerticalLine,
  stroke,
  strokeDasharray,
  strokeWidth,
  xScale,
  yScale,
  lineStyles,
}) {
  if (!xScale || !yScale || (!top && !left)) return null;

  const [xMin, xMax] = xScale.range();
  const [yMax, yMin] = yScale.range();
  return (
    <Group>
      {showHorizontalLine && top !== null &&
        <Line
          from={{ x: xMin, y: top }}
          to={{ x: fullWidth || left === null ? xMax : left, y: top }}
          style={lineStyles}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeWidth={strokeWidth}
        />}
      {showVerticalLine && top !== null &&
        <Line
          from={{ x: left, y: yMax }}
          to={{ x: left, y: top === null || fullHeight ? yMin : top }}
          style={lineStyles}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeWidth={strokeWidth}
        />}
      {showCircle && top !== null && left !== null &&
        <circle
          cx={left}
          cy={top}
          r={circleSize}
          fill={circleFill}
          stroke={circleStroke}
          strokeWidth={1}
          style={circleStyles}
        />}
    </Group>
  );
}

CrossHair.propTypes = propTypes;
CrossHair.defaultProps = defaultProps;

export default CrossHair;
