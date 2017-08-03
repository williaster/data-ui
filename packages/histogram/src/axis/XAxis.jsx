import React from 'react';
import PropTypes from 'prop-types';
import { AxisBottom, AxisTop } from '@vx/axis';

const propTypes = {
  axisStyles: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['bottom', 'top']),
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
  label: null,
  left: 0,
  numTicks: null,
  orientation: 'bottom',
  scale: null,
  tickFormat: null,
  tickLabelComponent: null,
  tickStyles: {},
  top: 0,
};

export default function XAxis({
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
  if (!scale) return null;
  const Axis = orientation === 'bottom' ? AxisBottom : AxisTop;
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

XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
XAxis.displayName = 'XAxis';
