import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@vx/grid';
import { Group } from '@vx/group';

import Voronoi from './Voronoi';
import WithTooltip, { withTooltipPropTypes } from '../enhancer/WithTooltip';

import {
  collectDataFromChildSeries,
  componentName,
  isAxis,
  isCrossHair,
  isBarSeries,
  isSeries,
  getChildWithName,
  getScaleForAccessor,
  numTicksForWidth,
  numTicksForHeight,
  propOrFallback,
} from '../utils/chartUtils';

import { scaleShape, themeShape } from '../utils/propShapes';

export const propTypes = {
  ...withTooltipPropTypes,
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
  renderTooltip: PropTypes.func,
  xScale: scaleShape.isRequired,
  yScale: scaleShape.isRequired,
  showXGrid: PropTypes.bool,
  showYGrid: PropTypes.bool,
  theme: themeShape,
  useVoronoi: PropTypes.bool,
  showVoronoi: PropTypes.bool,
};

const defaultProps = {
  children: null,
  margin: {
    top: 64,
    right: 64,
    bottom: 64,
    left: 64,
  },
  renderTooltip: null,
  showXGrid: false,
  showYGrid: false,
  theme: {},
  useVoronoi: false,
  showVoronoi: false,
};

// accessors
const getX = d => d.x;
const getY = d => d.y;
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
    const result = { allData };

    result.xScale = getScaleForAccessor({
      allData,
      minAccessor: d => (typeof d.x0 !== 'undefined' ? d.x0 : d.x),
      maxAccessor: d => (typeof d.x1 !== 'undefined' ? d.x1 : d.x),
      range: [0, innerWidth],
      ...xScale,
    });

    result.yScale = getScaleForAccessor({
      allData,
      minAccessor: d => (typeof d.y0 !== 'undefined' ? d.y0 : d.y),
      maxAccessor: d => (typeof d.y1 !== 'undefined' ? d.y1 : d.y),
      range: [innerHeight, 0],
      ...yScale,
    });

    React.Children.forEach(children, (Child) => { // Child-specific scales or adjustments here
      const name = componentName(Child);
      if (isBarSeries(name) && xScale.type !== 'band') {
        const dummyBand = getScaleForAccessor({
          allData: dataBySeriesType[name],
          minAccessor: xString,
          maxAccessor: xString,
          type: 'band',
          rangeRound: [0, innerWidth],
          paddingOuter: 1,
        });

        const offset = dummyBand.bandwidth() / 2;
        result.xScale.range([offset, innerWidth - offset]);
        result.xScale.barWidth = dummyBand.bandwidth();
        result.xScale.offset = offset;
      }
    });

    return result;
  }

  render() {
    if (this.props.renderTooltip) {
      return (
        <WithTooltip renderTooltip={this.props.renderTooltip}>
          <XYChart {...this.props} renderTooltip={null} />
        </WithTooltip>
      );
    }

    const {
      ariaLabel,
      children,
      showXGrid,
      showYGrid,
      theme,
      height,
      width,
      onMouseLeave,
      onMouseMove,
      tooltipData,
      showVoronoi,
      useVoronoi,
    } = this.props;

    const { margin, innerWidth, innerHeight } = this.getDimmensions();
    const { numXTicks, numYTicks } = this.getNumTicks(innerWidth, innerHeight);
    const { xScale, yScale, allData } = this.collectScalesFromProps(); // @TODO cache these?
    const barWidth = xScale.barWidth || (xScale.bandwidth && xScale.bandwidth()) || 0;

    const voronoiX = d => xScale(getX(d) || 0);
    const voronoiY = d => yScale(getY(d) || 0);
    let CrossHair; // ensure this is the top-most layer

    return innerWidth > 0 && innerHeight > 0 && (
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
              numTicksRows={showYGrid && numYTicks}
              numTicksColumns={showXGrid && numXTicks}
              stroke={theme.gridStyles && theme.gridStyles.stroke}
              strokeWidth={theme.gridStyles && theme.gridStyles.strokeWidth}
            />}

          {React.Children.map(children, (Child) => {
            const name = componentName(Child);
            if (isAxis(name)) {
              const styleKey = name[0].toLowerCase();
              return React.cloneElement(Child, {
                innerHeight,
                innerWidth,
                labelOffset: name === 'YAxis' ? 0.7 * margin[Child.props.orientation] : 0,
                numTicks: name === 'XAxis' ? numXTicks : numYTicks,
                scale: name === 'XAxis' ? xScale : yScale,
                rangePadding: name === 'XAxis' ? xScale.offset : null,
                axisStyles: { ...theme[`${styleKey}AxisStyles`], ...Child.props.axisStyles },
                tickStyles: { ...theme[`${styleKey}TickStyles`], ...Child.props.tickStyles },
              });
            } else if (isSeries(name)) {
              return React.cloneElement(Child, {
                xScale,
                yScale,
                barWidth,
                onMouseLeave: useVoronoi ? null : onMouseLeave,
                onMouseMove: useVoronoi ? null : onMouseMove,
              });
            } else if (isCrossHair(name)) {
              CrossHair = Child;
              return null;
            }
            return Child;
          })}

          {useVoronoi &&
            <Voronoi
              data={allData}
              x={voronoiX}
              y={voronoiY}
              width={innerWidth}
              height={innerHeight}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              showVoronoi={showVoronoi}
            />}

          {CrossHair && tooltipData &&
            React.cloneElement(CrossHair, {
              left: (
                xScale(getX(tooltipData.datum) || 0)
                + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0)
              ),
              top: yScale(getY(tooltipData.datum) || 0),
              xRange: xScale.range(),
              yRange: yScale.range(),
            })}
        </Group>
      </svg>
    );
  }
}

XYChart.propTypes = propTypes;
XYChart.defaultProps = defaultProps;

export default XYChart;
