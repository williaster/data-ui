import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

import { numTicksForHeight } from '../utils/scale-utils';
import { yAxisStyles, yTickStyles } from '../theme';

const propTypes = {
  hideZero: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  labelOffset: PropTypes.number,
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  rangePadding: PropTypes.number,
  tickLabelComponent: PropTypes.element,
  tickFormat: PropTypes.func,
  scale: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

const defaultProps = {
  axisStyles: {},
  hideZero: false,
  label: null,
  labelOffset: 0,
  numTicks: null,
  orientation: 'left',
  rangePadding: null,
  tickFormat: null,
  tickLabelComponent: undefined,
  tickStyles: {},
};

export default function YAxis({
  hideZero,
  width,
  label,
  labelOffset,
  numTicks,
  orientation,
  rangePadding,
  scale,
  tickFormat,
  tickLabelComponent,
}) {
  const Axis = orientation === 'left' ? AxisLeft : AxisRight;
  const height = Math.max(...scale.range());
  return (
    <Axis
      top={0}
      left={orientation === 'right' ? width : 0}
      rangePadding={rangePadding}
      hideTicks={numTicks === 0}
      hideZero={hideZero}
      label={typeof label === 'string' ?
        <text {...(yAxisStyles.label)[orientation]}>
          {label}
        </text>
        : label
      }
      labelOffset={labelOffset}
      numTicks={numTicksForHeight(height)}
      scale={scale}
      stroke={yAxisStyles.stroke}
      strokeWidth={yAxisStyles.strokeWidth}
      tickFormat={tickFormat}
      tickLength={yTickStyles.tickLength}
      tickStroke={yTickStyles.stroke}
      tickLabelComponent={
        tickLabelComponent ||
        <text {...(yTickStyles.label)[orientation]} />
      }
    />
  );
}

YAxis.width = 50;
YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
YAxis.displayName = 'YAxis';
