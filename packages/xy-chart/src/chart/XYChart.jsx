import React from 'react';
import PropTypes from 'prop-types';

import { extent } from 'd3-array';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { scaleLinear, scaleTime, scaleBand } from '@vx/scale';

import { componentName, getChildWithName, nonBandBarWidth, isBarSeries } from '../utils/chartUtils';
import { grid as defaultGridStyles } from '../theme';
import { scaleShape, gridStylesShape } from '../utils/propShapes';

const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  scales: PropTypes.shape({
    x: scaleShape.isRequired,
    y: scaleShape.isRequired,
  }).isRequired, // key matches data attribute
  gridStyles: gridStylesShape,
};

const defaultProps = {
  children: null,
  margin: {
    top: 64,
    right: 64,
    bottom: 64,
    left: 64,
  },
  gridStyles: defaultGridStyles,
};

const scaleTypeToScale = {
  time: scaleTime,
  linear: scaleLinear,
  band: scaleBand,
};

class XYChart extends React.PureComponent {
  getDimmensions() {
    const { margin, width, height } = this.props;
    const completeMargin = { ...defaultProps.margin, ...margin };
    return {
      margin: completeMargin,
      innerHeight: height - completeMargin.top - completeMargin.bottom,
      innerWidth: width - completeMargin.left - completeMargin.right,
    };
  }

  getNumTicks() {
    const xAxis = getChildWithName('XAxis', this.props.children);
    const yAxis = getChildWithName('YAxis', this.props.children);
    return {
      x: (xAxis && xAxis.props.numTicks) || 0,
      y: (yAxis && yAxis.props.numTicks) || 0,
    };
  }

  getScales() {
    const { scales: scaleProp, children } = this.props;
    const { innerWidth, innerHeight } = this.getDimmensions();
    const allData = this.collectDataFromChildSeries();
    const scales = {};

    Object.entries(scaleProp).forEach(([attr, { type, includeZero, ...rest }]) => {
      let scale;
      let barWidth;
      let range;
      let domain;
      let offset = 0;

      if (type === 'band') {
        range = attr === 'x' ? [0, innerWidth] : [innerHeight, 0];
        domain = allData.map(d => d[attr]);
        scale = scaleTypeToScale[type]({ domain, range, ...rest });
        barWidth = scale.bandwidth();
      } else {
        const [min, max] = extent(allData, d => d[attr]);
        domain = [
          type === 'linear' && includeZero ? Math.min(0, min) : min,
          type === 'linear' && includeZero ? Math.max(0, max) : max,
        ];

        const totalWidth = attr === 'x' ? innerWidth : innerHeight;
        barWidth = attr === 'x' ? nonBandBarWidth({ totalWidth, children }) : 0;
        offset = barWidth / 2;
        range = attr === 'x' ? [offset, innerWidth - offset] : [innerHeight - offset, 0];
        scale = scaleTypeToScale[type]({ domain, range, ...rest });
      }

      scales[`${attr}Scale`] = scale;
      scales[`${attr}BarWidth`] = barWidth;
      scales[`${attr}Offset`] = offset;
    });

    return scales;
  }

  collectDataFromChildSeries() {
    const { children } = this.props;
    let data = [];
    React.Children.forEach(children, (child) => {
      if (child.props && child.props.data) {
        data = data.concat(child.props.data);
      }
    });
    return data;
  }

  render() {
    const {
      ariaLabel,
      children,
      gridStyles,
      height,
      width,
    } = this.props;

    const { margin, innerWidth, innerHeight } = this.getDimmensions();
    const { xScale, yScale, xBarWidth, xOffset } = this.getScales();
    const numTicks = this.getNumTicks();

    return (
      <svg
        aria-label={ariaLabel}
        role="img"
        width={width}
        height={height}
      >
        <Group left={margin.left} top={margin.top}>
          {(numTicks.x || numTicks.y) &&
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
              stroke={gridStyles.stroke}
              strokeWidth={gridStyles.strokeWidth}
              numTicksRows={numTicks.y}
              numTicksColumns={numTicks.x}
            />}
          {React.Children.map(children, (Child) => {
            const name = componentName(Child);
            if (name.match(/Series$/)) {
              const barWidth = isBarSeries(name) && xBarWidth;
              return React.cloneElement(Child, { xScale, yScale, barWidth });
            }
            if (name.match(/Axis$/)) {
              return React.cloneElement(Child, {
                innerHeight,
                innerWidth,
                labelOffset: name === 'YAxis' ? 0.6 * margin.right : 0,
                numTicks: name === 'XAxis' ? numTicks.x : numTicks.y,
                scale: name === 'XAxis' ? xScale : yScale,
                rangePadding: name === 'XAxis' ? xOffset : null,
              });
            }
            return Child;
          })}
        </Group>
      </svg>
    );
  }
}

XYChart.propTypes = propTypes;
XYChart.defaultProps = defaultProps;

export default XYChart;
