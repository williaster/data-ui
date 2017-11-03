import React from 'react';
import PropTypes from 'prop-types';
import AxisLeft from '@vx/axis/build/axis/AxisLeft';
import AxisRight from '@vx/axis/build/axis/AxisRight';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

const propTypes = {
  axisStyles: axisStylesShape,
  hideZero: PropTypes.bool,
  label: PropTypes.string,
  labelProps: PropTypes.object,
  labelOffset: PropTypes.number,
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  rangePadding: PropTypes.number,
  tickStyles: tickStylesShape,
  tickLabelProps: PropTypes.func,
  tickFormat: PropTypes.func,
  tickValues: PropTypes.array,

  // probably injected by parent
  innerWidth: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  hideZero: false,
  innerWidth: null,
  label: null,
  labelProps: null,
  labelOffset: 0,
  numTicks: null,
  orientation: 'right',
  rangePadding: null,
  scale: null,
  tickFormat: null,
  tickLabelProps: null,
  tickStyles: {},
  tickValues: undefined,
};

export default class YAxis extends React.PureComponent {
  render() {
    const {
      axisStyles,
      hideZero,
      innerWidth,
      label,
      labelProps,
      labelOffset,
      numTicks,
      orientation,
      rangePadding,
      scale,
      tickFormat,
      tickLabelProps: passedTickLabelProps,
      tickStyles,
      tickValues,
    } = this.props;
    if (!scale || !innerWidth) return null;

    const Axis = orientation === 'left' ? AxisLeft : AxisRight;

    const tickLabelProps = passedTickLabelProps ||
      (tickStyles.label && tickStyles.label[orientation])
        ? () => tickStyles.label[orientation] : undefined;

    return (
      <Axis
        top={0}
        left={orientation === 'right' ? innerWidth : 0}
        rangePadding={rangePadding}
        hideTicks={numTicks === 0}
        hideZero={hideZero}
        label={label}
        labelProps={labelProps || (axisStyles.label || {})[orientation]}
        labelOffset={labelOffset}
        numTicks={numTicks}
        scale={scale}
        stroke={axisStyles.stroke}
        strokeWidth={axisStyles.strokeWidth}
        tickFormat={tickFormat}
        tickLabelProps={tickLabelProps}
        tickLength={tickStyles.tickLength}
        tickStroke={tickStyles.stroke}
        tickValues={tickValues}
      />
    );
  }
}

YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
YAxis.displayName = 'YAxis';
