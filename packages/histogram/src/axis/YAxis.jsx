import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

// import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

const propTypes = {
  axisStyles: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  tickStyles: PropTypes.object,
  tickLabelComponent: PropTypes.element,
  tickFormat: PropTypes.func,

  // probably injected by parent
  top: PropTypes.number,
  left: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  innerHeight: null,
  label: null,
  left: 0,
  numTicks: 5,
  orientation: 'left',
  scale: null,
  tickFormat: null,
  tickLabelComponent: null,
  tickStyles: {},
  top: 0,
};

export default function YAxis({
  axisStyles,
  label,
  top,
  left,
  numTicks,
  orientation,
  scale,
  tickFormat,
  tickLabelComponent,
  tickStyles,
}) {
  if (!scale || !innerHeight) return null;
  const Axis = orientation === 'left' ? AxisLeft : AxisRight;
  return (
    <Axis
      top={top}
      left={left}
      hideTicks={false}
      hideZero={false}
      label={typeof label === 'string' && axisStyles.label ?
        <text {...(axisStyles.label || {})[orientation]}>
          {label}
        </text>
        : label
      }
      numTicks={numTicks}
      scale={scale}
      stroke={axisStyles.stroke}
      strokeWidth={axisStyles.strokeWidth}
      tickFormat={tickFormat}
      tickLength={tickStyles.tickLength}
      tickStroke={tickStyles.stroke}
      tickLabelComponent={tickLabelComponent || (tickStyles.label &&
        <text {...(tickStyles.label || {})[orientation]} />
      )}
    />
  );
}

YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
YAxis.displayName = 'YAxis';
