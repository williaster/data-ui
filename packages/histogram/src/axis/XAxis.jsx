import React from 'react';
import PropTypes from 'prop-types';
import { AxisBottom, AxisTop } from '@vx/axis';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

const propTypes = {
  axisStyles: axisStylesShape,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  labelProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['bottom', 'top']),
  tickStyles: tickStylesShape,
  tickLabelProps: PropTypes.func,
  tickFormat: PropTypes.func,
  tickValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),

  // probably injected by parent
  top: PropTypes.number,
  left: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  label: null,
  labelProps: null,
  left: 0,
  numTicks: null,
  orientation: 'bottom',
  scale: null,
  tickFormat: null,
  tickLabelProps: undefined,
  tickStyles: {},
  top: 0,
  tickValues: undefined,
};

export default function XAxis({
  axisStyles,
  label,
  labelProps,
  top,
  left,
  numTicks,
  orientation,
  scale,
  tickFormat,
  tickLabelProps: passedTickLabelProps,
  tickStyles,
  tickValues,
}) {
  if (!scale) return null;
  const Axis = orientation === 'bottom' ? AxisBottom : AxisTop;
  const tickLabelProps =
    passedTickLabelProps || (tickStyles.label && tickStyles.label[orientation])
      ? () => tickStyles.label[orientation]
      : undefined;

  return (
    <Axis
      top={top}
      left={left}
      hideTicks={false}
      hideZero={false}
      label={label}
      labelProps={labelProps || (axisStyles.label || {})[orientation]}
      numTicks={numTicks}
      scale={scale}
      stroke={axisStyles.stroke}
      strokeWidth={axisStyles.strokeWidth}
      tickFormat={tickFormat}
      tickLength={tickStyles.tickLength}
      tickLabelProps={tickLabelProps}
      tickStroke={tickStyles.stroke}
      tickValues={tickValues}
    />
  );
}

XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
XAxis.displayName = 'XAxis';
