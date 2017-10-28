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
  isCirclePackSeries,
  isCrossHair,
  isBarSeries,
  isReferenceLine,
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
  static collectScalesFromProps(props) {
    const { xScale: xScaleObject, yScale: yScaleObject, children } = props;
    const { innerWidth, innerHeight } = XYChart.getDimmensions(props);
    const { allData, dataByIndex, dataBySeriesType } = collectDataFromChildSeries(children);

    const xScale = getScaleForAccessor({
      allData,
      minAccessor: d => (typeof d.x0 !== 'undefined' ? d.x0 : d.x),
      maxAccessor: d => (typeof d.x1 !== 'undefined' ? d.x1 : d.x),
      range: [0, innerWidth],
      ...xScaleObject,
    });

    const yScale = getScaleForAccessor({
      allData,
      minAccessor: d => (typeof d.y0 !== 'undefined' ? d.y0 : d.y),
      maxAccessor: d => (typeof d.y1 !== 'undefined' ? d.y1 : d.y),
      range: [innerHeight, 0],
      ...yScaleObject,
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
        xScale.range([offset, innerWidth - offset]);
        xScale.barWidth = dummyBand.bandwidth();
        xScale.offset = offset;
      }
      if (isCirclePackSeries(name)) {
        yScale.domain([-innerHeight / 2, innerHeight / 2]);
      }
    });

    return {
      allData,
      dataByIndex,
      xScale,
      yScale,
    };
  }

  static getDimmensions(props) {
    const { margin, width, height } = props;
    const completeMargin = { ...defaultProps.margin, ...margin };
    return {
      margin: completeMargin,
      innerHeight: height - completeMargin.top - completeMargin.bottom,
      innerWidth: width - completeMargin.left - completeMargin.right,
    };
  }

  static getStateFromProps(props) {
    const { margin, innerWidth, innerHeight } = XYChart.getDimmensions(props);
    const { allData, dataByIndex, xScale, yScale } = XYChart.collectScalesFromProps(props);

    return {
      allData,
      dataByIndex,
      innerHeight,
      innerWidth,
      margin,
      xScale,
      yScale,
      voronoiX: d => xScale(getX(d)),
      voronoiY: d => yScale(getY(d)),
    };
  }

  constructor(props) {
    super(props);
    // if renderTooltip is passed we return another XYChart wrapped in WithTooltip
    // therefore we don't want to compute state if the nested chart will do so
    this.state = props.renderTooltip ? {} : XYChart.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if ([ // recompute scales if any of the following change
      'children',
      'height',
      'margin',
      'width',
      'xScale',
      'yScale',
    ].some(prop => this.props[prop] !== nextProps[prop])) {
      this.setState(XYChart.getStateFromProps(nextProps));
    }
  }

  getNumTicks(innerWidth, innerHeight) {
    const xAxis = getChildWithName('XAxis', this.props.children);
    const yAxis = getChildWithName('YAxis', this.props.children);
    return {
      numXTicks: propOrFallback(xAxis && xAxis.props, 'numTicks', numTicksForWidth(innerWidth)),
      numYTicks: propOrFallback(yAxis && yAxis.props, 'numTicks', numTicksForHeight(innerHeight)),
    };
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

    const {
      allData,
      dataByIndex,
      innerWidth,
      innerHeight,
      margin,
      voronoiX,
      voronoiY,
      xScale,
      yScale,
    } = this.state;

    const { numXTicks, numYTicks } = this.getNumTicks(innerWidth, innerHeight);
    const barWidth = xScale.barWidth || (xScale.bandwidth && xScale.bandwidth()) || 0;
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

          {React.Children.map(children, (Child, childIndex) => {
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
                data: dataByIndex[childIndex],
                xScale,
                yScale,
                barWidth,
                onMouseLeave: useVoronoi ? null : onMouseLeave,
                onMouseMove: useVoronoi ? null : onMouseMove,
              });
            } else if (isCrossHair(name)) {
              CrossHair = Child;
              return null;
            } else if (isReferenceLine(name)) {
              return React.cloneElement(Child, { xScale, yScale });
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
XYChart.displayName = 'XYChart';

export default XYChart;
