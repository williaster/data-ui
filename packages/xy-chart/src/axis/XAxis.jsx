import React from 'react';
import PropTypes from 'prop-types';

import { AxisBottom, AxisTop } from '@vx/axis';
import { xAxis as defaultAxisStyles, xTick as defaultTickStyles } from '../theme';

const propTypes = {
  axisPadding: PropTypes.number,
  orientation: PropTypes.oneOf(['bottom', 'top']),
  hideZero: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
  innerHeight: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired,
};

const defaultProps = {
  axisPadding: null,
  axisStyles: defaultAxisStyles,
  hideZero: false,
  label: null,
  numTicks: null,
  orientation: 'bottom',
  tickFormat: null,
  tickLabelComponent: null,
  tickStyles: defaultTickStyles,
  tickValues: null,
};

export default function XAxis({
  axisPadding,
  axisStyles,
  innerHeight,
  hideZero,
  label,
  numTicks,
  orientation,
  scale,
  tickFormat,
  tickLabelComponent,
  tickStyles,
  tickValues,
}) {
  const Axis = orientation === 'bottom' ? AxisBottom : AxisTop;
  return (
    <Axis
      top={orientation === 'bottom' ? innerHeight : 0}
      left={0}
      axisPadding={axisPadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' ?
        <text {...(axisStyles.label || {})[orientation]}>
          {label}
        </text>
        : label
      }
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

XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
XAxis.displayName = 'XAxis';
