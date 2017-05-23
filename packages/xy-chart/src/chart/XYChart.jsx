import React from 'react';
import PropTypes from 'prop-types';
import { componentWithName } from 'airbnb-prop-types';

import { extent } from 'd3-array';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { scaleLinear, scaleTime, scaleOrdinal } from '@vx/scale';

import { componentName, getChildWithName } from '../utils/chartUtils';
import { grid as defaultGridStyles } from '../theme';
import { scaleShape } from '../utils/propShapes';

const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: componentWithName(/(Series|Axis)$/),
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
  gridStyles: PropTypes.shape({
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }),
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
  ordinal: scaleOrdinal,
};

class XYChart extends React.Component {

  // @todo: refactor this, if axis is categorical can rely on range bands
  getBarWidth({ innerWidth }) {
    let barWidth = Infinity;
    React.Children.forEach(this.props.children, (Child) => {
      if (componentName(Child).match(/Bar/g)) {
        const data = Child.props.data;
        barWidth = Math.min(barWidth, (innerWidth / data.length) - 6);
      }
    });
    return Math.max(0, barWidth === Infinity ? 0 : barWidth);
  }

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
    const { scales: scaleProp } = this.props;
    const { innerWidth, innerHeight } = this.getDimmensions();
    const allData = this.collectDataFromChildSeries();
    const barWidth = this.getBarWidth({ innerWidth });

    const scales = {};
    Object.entries(scaleProp).forEach(([key, { accessor, type, includeZero, ...rest }]) => {
      const [min, max] = extent(allData, d => (accessor ? accessor(d) : d[key]));

      let range;
      if (key === 'x') range = [0 + (barWidth / 2), innerWidth - (barWidth / 2)];
      if (key === 'y') range = [innerHeight, 0];

      scales[key] = scaleTypeToScale[type]({
        domain: [
          type === 'linear' && includeZero ? Math.min(0, min) : min,
          type === 'linear' && includeZero ? Math.max(0, max) : max,
        ],
        range,
        ...rest,
      });

      scales[key].accessor = accessor;
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
    const scales = this.getScales();
    const numTicks = this.getNumTicks();
    const barWidth = this.getBarWidth({ innerWidth });
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
              xScale={scales.x}
              yScale={scales.y}
              width={innerWidth}
              height={innerHeight}
              stroke={gridStyles.stroke}
              strokeWidth={gridStyles.strokeWidth}
              numTicksRows={numTicks.y}
              numTicksColumns={numTicks.x}
            />}
          {React.Children.map(children, (child) => {
            const name = componentName(child);
            if (name.match(/Series$/)) {
              return React.cloneElement(child, {
                scales,
                barWidth: name.match(/Bar/g) && barWidth,
              });
            }
            if (name.match(/Axis$/)) {
              return React.cloneElement(child, {
                innerHeight,
                innerWidth,
                labelOffset: name === 'YAxis' ? 0.6 * margin.right : 0,
                numTicks: name === 'XAxis' ? numTicks.x : numTicks.y,
                scale: name === 'XAxis' ? scales.x : scales.y,
              });
            }
            return child;
          })}
        </Group>
      </svg>
    );
  }
}

XYChart.propTypes = propTypes;
XYChart.defaultProps = defaultProps;

export default XYChart;
