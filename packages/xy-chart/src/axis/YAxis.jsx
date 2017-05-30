import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

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
  innerWidth: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  hideZero: false,
  innerWidth: null,
  label: null,
  labelOffset: 0,
  numTicks: null,
  orientation: 'right',
  rangePadding: null,
  scale: null,
  tickFormat: null,
  tickLabelComponent: undefined,
  tickStyles: {},
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
  if (!scale || !innerWidth) return null;

  const Axis = orientation === 'left' ? AxisLeft : AxisRight;
  return (
    <Axis
      top={0}
      left={orientation === 'right' ? innerWidth : 0}
      rangePadding={rangePadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' && axisStyles.label ?
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
      tickLabelComponent={tickLabelComponent || (tickStyles.label &&
        <text {...(tickStyles.label || {})[orientation]} />
      )}
    />
  );
}

YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
YAxis.displayName = 'YAxis';
