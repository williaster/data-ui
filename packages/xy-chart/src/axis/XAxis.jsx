import React from 'react';
import PropTypes from 'prop-types';
import AxisBottom from '@vx/axis/build/axis/AxisBottom';
import AxisTop from '@vx/axis/build/axis/AxisTop';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

const propTypes = {
  axisStyles: axisStylesShape,
  hideZero: PropTypes.bool,
  label: PropTypes.string,
  labelProps: PropTypes.object,
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['bottom', 'top']),
  rangePadding: PropTypes.number,
  tickStyles: tickStylesShape,
  tickLabelProps: PropTypes.func,
  tickFormat: PropTypes.func,
  tickValues: PropTypes.array,

  // probably injected by parent
  innerHeight: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  hideZero: false,
  innerHeight: null,
  label: null,
  labelProps: null,
  numTicks: null,
  orientation: 'bottom',
  rangePadding: null,
  scale: null,
  tickFormat: null,
  tickLabelProps: null,
  tickStyles: {},
  tickValues: undefined,
};

export default class XAxis extends React.PureComponent {
  render() {
    const {
      axisStyles,
      innerHeight,
      hideZero,
      label,
      labelProps,
      numTicks,
      orientation,
      rangePadding,
      scale,
      tickFormat,
      tickLabelProps: passedTickLabelProps,
      tickStyles,
      tickValues,
    } = this.props;
    if (!scale || !innerHeight) return null;
    const Axis = orientation === 'bottom' ? AxisBottom : AxisTop;

    const tickLabelProps = passedTickLabelProps ||
      (tickStyles.label && tickStyles.label[orientation])
        ? () => tickStyles.label[orientation] : undefined;

    return (
      <Axis
        top={orientation === 'bottom' ? innerHeight : 0}
        left={0}
        rangePadding={rangePadding}
        hideTicks={numTicks === 0}
        hideZero={hideZero}
        label={label}
        labelProps={labelProps || (axisStyles.label || {})[orientation]}
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

XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
XAxis.displayName = 'XAxis';
