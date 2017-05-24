import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';
import { yAxis as defaultAxisStyles, yTick as defaultTickStyles } from '../theme';

const propTypes = {
  axisStyles: axisStylesShape,
  hideZero: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  labelOffset: PropTypes.number,
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  rangePadding: PropTypes.number,
  tickStyles: tickStylesShape,
  tickLabelComponent: PropTypes.element,
  tickFormat: PropTypes.func,

  // probably injected by parent
  innerWidth: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired,
};

const defaultProps = {
  axisStyles: defaultAxisStyles,
  hideZero: false,
  label: null,
  labelOffset: 0,
  numTicks: null,
  orientation: 'right',
  rangePadding: null,
  tickFormat: null,
  tickLabelComponent: null,
  tickStyles: defaultTickStyles,
};

export default function YAxis({
  axisStyles,
  hideZero,
  innerWidth,
  label,
  labelOffset,
  numTicks,
  orientation,
  rangePadding,
  scale,
  tickFormat,
  tickLabelComponent,
  tickStyles,
}) {
  const Axis = orientation === 'left' ? AxisLeft : AxisRight;
  return (
    <Axis
      top={0}
      left={orientation === 'right' ? innerWidth : 0}
      rangePadding={rangePadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' ?
        <text {...(axisStyles.label || {})[orientation]}>
          {label}
        </text>
        : label
      }
      labelOffset={labelOffset}
      numTicks={numTicks}
      scale={scale}
      stroke={axisStyles.stroke}
      strokeWidth={axisStyles.strokeWidth}
      tickFormat={tickFormat}
      tickLength={tickStyles.tickLength}
      tickStroke={tickStyles.stroke}
      tickLabelComponent={tickLabelComponent || <text {...(tickStyles.label || {})[orientation]} />}
    />
  );
}

YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
YAxis.displayName = 'YAxis';
