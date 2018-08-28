import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisRight } from '@vx/axis';

import { axisStylesShape, tickStylesShape } from '../utils/propShapes';

const propTypes = {
  axisStyles: axisStylesShape,
  hideZero: PropTypes.bool,
  label: PropTypes.string,
  labelProps: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  labelOffset: PropTypes.number,
  numTicks: PropTypes.number,
  orientation: PropTypes.oneOf(['left', 'right']),
  rangePadding: PropTypes.number,
  tickComponent: PropTypes.func,
  tickStyles: tickStylesShape,
  tickLabelProps: PropTypes.func,
  tickFormat: PropTypes.func,
  tickValues: PropTypes.arrayOf(
    // number or date/moment object
    PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
  ),

  // probably injected by parent
  innerWidth: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.func,
};

const defaultProps = {
  axisStyles: {},
  hideZero: false,
  innerWidth: null,
  height: null,
  label: null,
  labelProps: null,
  labelOffset: undefined,
  numTicks: null,
  orientation: 'right',
  rangePadding: null,
  scale: null,
  tickComponent: null,
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
      height,
      label,
      labelProps,
      labelOffset,
      numTicks,
      orientation,
      rangePadding,
      scale,
      tickComponent,
      tickFormat,
      tickLabelProps: passedTickLabelProps,
      tickStyles,
      tickValues,
    } = this.props;
    if (!scale || !innerWidth) return null;

    const Axis = orientation === 'left' ? AxisLeft : AxisRight;

    let tickLabelProps = passedTickLabelProps;
    if (!tickLabelProps) {
      tickLabelProps =
        tickStyles.label && tickStyles.label[orientation]
          ? () => tickStyles.label[orientation]
          : undefined;
    }

    return (
      <Axis
        top={0}
        left={orientation === 'right' ? innerWidth : 0}
        rangePadding={rangePadding}
        hideTicks={numTicks === 0}
        hideZero={hideZero}
        label={label}
        labelProps={{
          verticalAnchor: 'start',
          width: Math.max(...scale.range(), height || 0),
          ...(labelProps || (axisStyles.label || {})[orientation]),
        }}
        labelOffset={labelOffset}
        numTicks={numTicks}
        scale={scale}
        stroke={axisStyles.stroke}
        strokeWidth={axisStyles.strokeWidth}
        tickComponent={tickComponent}
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
