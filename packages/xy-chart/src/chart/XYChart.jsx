import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@vx/grid';
import { Group } from '@vx/group';

import {
  collectDataFromChildSeries,
  componentName,
  isAxis,
  isBarSeries,
  isSeries,
  getChildWithName,
  getScaleForAccessor,
  numTicksForWidth,
  numTicksForHeight,
  propOrFallback,
} from '../utils/chartUtils';

import { scaleShape, themeShape } from '../utils/propShapes';

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
  xScale: scaleShape.isRequired,
  yScale: scaleShape.isRequired,
  showXGrid: PropTypes.bool,
  showYGrid: PropTypes.bool,
  theme: themeShape,
};

const defaultProps = {
  children: null,
  margin: {
    top: 64,
    right: 64,
    bottom: 64,
    left: 64,
  },
  showXGrid: false,
  showYGrid: false,
  theme: {},
};

// accessors
const x = d => d.x;
const y = d => d.y;
const xString = d => d.x.toString();

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

  getNumTicks(innerWidth, innerHeight) {
    const xAxis = getChildWithName('XAxis', this.props.children);
    const yAxis = getChildWithName('YAxis', this.props.children);
    return {
      numXTicks: propOrFallback(xAxis && xAxis.props, 'numTicks', numTicksForWidth(innerWidth)),
      numYTicks: propOrFallback(yAxis && yAxis.props, 'numTicks', numTicksForHeight(innerHeight)),
    };
  }

  collectScalesFromProps() {
    const { xScale, yScale, children } = this.props;
    const { innerWidth, innerHeight } = this.getDimmensions();
    const { allData, dataBySeriesType } = collectDataFromChildSeries(children);
    const scales = {};

    scales.xScale = getScaleForAccessor({
      allData,
      accessor: x,
      range: [0, innerWidth],
      ...xScale,
    });

    scales.yScale = getScaleForAccessor({
      allData,
      accessor: y,
      range: [innerHeight, 0],
      ...yScale,
    });

    React.Children.forEach(children, (Child) => { // Child-specific scales or adjustments here
      const name = componentName(Child);
      if (isBarSeries(name) && xScale.type !== 'band') {
        const dummyBand = getScaleForAccessor({
          allData: dataBySeriesType[name],
          accessor: xString,
          type: 'band',
          rangeRound: [0, innerWidth],
          paddingOuter: 1,
        });

        const offset = dummyBand.bandwidth() / 2;
        scales.xScale.range([offset, innerWidth - offset]);
        scales.xScale.barWidth = dummyBand.bandwidth();
        scales.xScale.offset = offset;
      }
    });

    return scales;
  }

  render() {
    const {
      ariaLabel,
      children,
      showXGrid,
      showYGrid,
      theme,
      height,
      width,
    } = this.props;

    const { margin, innerWidth, innerHeight } = this.getDimmensions();
    const { numXTicks, numYTicks } = this.getNumTicks(innerWidth, innerHeight);
    const { xScale, yScale } = this.collectScalesFromProps();
    return (
      <svg
        aria-label={ariaLabel}
        role="img"
        width={width}
        height={height}
      >
        <Group left={margin.left} top={margin.top}>
          {(showXGrid || showYGrid) && (numXTicks || numYTicks) &&
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
              stroke={theme.gridStyles && theme.gridStyles.stroke}
              strokeWidth={theme.gridStyles && theme.gridStyles.strokeWidth}
              numTicksRows={showYGrid && numYTicks}
              numTicksColumns={showXGrid && numXTicks}
            />}
          {React.Children.map(children, (Child) => {
            const name = componentName(Child);
            if (isAxis(name)) {
              const styleKey = name[0].toLowerCase();
              return React.cloneElement(Child, {
                innerHeight,
                innerWidth,
                labelOffset: name === 'YAxis' ? 0.6 * margin.right : 0,
                numTicks: name === 'XAxis' ? numXTicks : numYTicks,
                scale: name === 'XAxis' ? xScale : yScale,
                rangePadding: name === 'XAxis' ? xScale.offset : null,
                axisStyles: { ...theme[`${styleKey}AxisStyles`], ...Child.props.axisStyles },
                tickStyles: { ...theme[`${styleKey}TickStyles`], ...Child.props.tickStyles },
              });
            } else if (isSeries(name)) {
              const barWidth = (isBarSeries(name) && (xScale.barWidth || xScale.bandwidth())) || 0;
              return React.cloneElement(Child, { xScale, yScale, barWidth });
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
