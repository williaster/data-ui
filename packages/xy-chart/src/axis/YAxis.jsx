import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

import { yAxis as defaultAxisStyles, yTick as defaultTickStyles } from '../theme';

const propTypes = {
  axisPadding: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  hideZero: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  labelOffset: PropTypes.number,
  numTicks: PropTypes.number,
  axisStyles: PropTypes.shape({
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    label: PropTypes.shape({
      bottom: PropTypes.object,
      top: PropTypes.object,
    }),
  }),
  tickStyles: PropTypes.shape({
    stroke: PropTypes.string,
    tickLength: PropTypes.number,
    label: PropTypes.shape({
      bottom: PropTypes.object,
      top: PropTypes.object,
    }),
  }),
  tickLabelComponent: PropTypes.element,
  tickFormat: PropTypes.func,
  tickValues: PropTypes.arrayOf(PropTypes.string),

  // probably injected by parent
  innerWidth: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired,
};

const defaultProps = {
  axisPadding: null,
  axisStyles: defaultAxisStyles,
  hideZero: false,
  label: null,
  labelOffset: 0,
  numTicks: null,
  orientation: 'right',
  tickFormat: null,
  tickLabelComponent: null,
  tickStyles: defaultTickStyles,
  tickValues: null,
};

export default function YAxis({
  axisPadding,
  axisStyles,
  hideZero,
  innerWidth,
  label,
  labelOffset,
  numTicks,
  orientation,
  scale,
  tickFormat,
  tickLabelComponent,
  tickStyles,
  tickValues,
}) {
  const Axis = orientation === 'left' ? AxisLeft : AxisRight;
  return (
    <Axis
      top={0}
      left={orientation === 'right' ? innerWidth : 0}
      axisPadding={axisPadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' ?
        <text {...(axisStyles.label || {})[orientation]}>
          {label}
        </text>
        : label
      }
      labelOffset={labelOffset}
      numTicks={typeof numTicks === 'number' ? numTicks : tickValues && tickValues.length}
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
