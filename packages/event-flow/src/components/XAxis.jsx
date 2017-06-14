import React from 'react';
import PropTypes from 'prop-types';
import { AxisBottom, AxisTop } from '@vx/axis';

import { xAxisStyles, xTickStyles } from '../theme';
import { numTicksForWidth } from '../utils/scale-utils';

const propTypes = {
  hideZero: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['bottom', 'top']),
  rangePadding: PropTypes.number,
  tickLabelComponent: PropTypes.element,
  height: PropTypes.number.isRequired,
  scale: PropTypes.func.isRequired,
  tickFormat: PropTypes.func,
};

const defaultProps = {
  hideZero: false,
  label: null,
  numTicks: null,
  orientation: 'top',
  rangePadding: null,
  tickLabelComponent: null,
  tickFormat: null,
};

export default function XAxis({
  height,
  hideZero,
  label,
  numTicks,
  orientation,
  rangePadding,
  scale,
  tickLabelComponent,
  tickFormat,
}) {
  const Axis = orientation === 'bottom' ? AxisBottom : AxisTop;
  const width = Math.max(...scale.range());
  return (
    <Axis
      top={orientation === 'bottom' ? height : 0}
      left={0}
      rangePadding={rangePadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' ?
        <text {...(xAxisStyles.label || {})[orientation]}>
          {label}
        </text>
        : label
      }
      numTicks={numTicksForWidth(width)}
      scale={scale}
      stroke={xAxisStyles.stroke}
      strokeWidth={xAxisStyles.strokeWidth}
      tickFormat={tickFormat}
      tickLength={xTickStyles.tickLength}
      tickStroke={xTickStyles.stroke}
      tickLabelComponent={
        tickLabelComponent ||
        <text {...(xTickStyles.label)[orientation]} />
      }
    />
  );
}

XAxis.height = 50;
XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
XAxis.displayName = 'XAxis';
