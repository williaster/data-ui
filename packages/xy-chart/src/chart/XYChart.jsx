import React from 'react';
import PropTypes from 'prop-types';

import { GridColumns, GridRows } from '@vx/grid';
import { Group } from '@vx/group';
import { WithTooltip } from '@data-ui/shared';

import collectVoronoiData from '../utils/collectVoronoiData';
import findClosestDatums from '../utils/findClosestDatums';
import shallowCompareObjectEntries from '../utils/shallowCompareObjectEntries';
import Voronoi from './Voronoi';

import {
  componentName,
  isAxis,
  isCrossHair,
  isDefined,
  isReferenceLine,
  isSeries,
  isBrush,
  getChildWithName,
  numTicksForWidth,
  numTicksForHeight,
  propOrFallback,
  DEFAULT_CHART_MARGIN,
} from '../utils/chartUtils';

import collectScalesFromProps from '../utils/collectScalesFromProps';
import getChartDimensions from '../utils/getChartDimensions';

import { scaleShape, themeShape, stringNumberDateObjectPropType } from '../utils/propShapes';

export const CONTAINER_TRIGGER = 'container';
export const SERIES_TRIGGER = 'series';
export const VORONOI_TRIGGER = 'voronoi';
const Y_LABEL_OFFSET = 0.7;

export const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  disableMouseEvents: PropTypes.bool,
  eventTrigger: PropTypes.oneOf([CONTAINER_TRIGGER, SERIES_TRIGGER, VORONOI_TRIGGER]),
  eventTriggerRefs: PropTypes.func,
  height: PropTypes.number.isRequired,
  innerRef: PropTypes.func,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  renderTooltip: PropTypes.func,
  showXGrid: PropTypes.bool,
  xGridValues: PropTypes.arrayOf(stringNumberDateObjectPropType),
  xGridOffset: PropTypes.number,
  showYGrid: PropTypes.bool,
  yGridValues: PropTypes.arrayOf(stringNumberDateObjectPropType),
  yGridOffset: PropTypes.number,
  showVoronoi: PropTypes.bool,
  snapTooltipToDataX: PropTypes.bool,
  snapTooltipToDataY: PropTypes.bool,
  theme: themeShape,
  width: PropTypes.number.isRequired,
  xScale: scaleShape.isRequired,
  yScale: scaleShape.isRequired,

  // these may be passed from WithTooltip
  onClick: PropTypes.func, // expects to be called like func({ event, datum })
  onMouseMove: PropTypes.func, // expects to be called like func({ event, datum })
  onMouseLeave: PropTypes.func, // expects to be called like func({ event, datum })
  tooltipData: PropTypes.shape({
    event: PropTypes.object,
    datum: PropTypes.object,
    series: PropTypes.object,
  }),
};

export const defaultProps = {
  children: null,
  disableMouseEvents: false,
  eventTrigger: SERIES_TRIGGER,
  eventTriggerRefs: null,
  innerRef: null,
  margin: DEFAULT_CHART_MARGIN,
  renderTooltip: null,
  showVoronoi: false,
  showXGrid: false,
  xGridValues: null,
  xGridOffset: null,
  showYGrid: false,
  yGridValues: null,
  yGridOffset: null,
  snapTooltipToDataX: false,
  snapTooltipToDataY: false,
  theme: {},
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
  tooltipData: null,
};

// accessors
const getX = d => d && d.x;
const getY = d => d && d.y;

class XYChart extends React.PureComponent {
  constructor(props) {
    super(props);
    // if renderTooltip is passed we return another XYChart wrapped in WithTooltip
    // therefore we don't want to compute state if the nested chart will do so
    this.state = props.renderTooltip ? {} : XYChart.getStateFromProps(props);

    this.getDatumCoords = this.getDatumCoords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleContainerEvent = this.handleContainerEvent.bind(this);
  }

  componentDidMount() {
    const { renderTooltip, eventTriggerRefs } = this.props;
    if (!renderTooltip && eventTriggerRefs) {
      eventTriggerRefs({
        mousemove: this.handleMouseMove,
        mouseleave: this.handleMouseLeave,
        click: this.handleClick,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let shouldComputeScales = false;
    if (
      ['width', 'height', 'children'].some(
        prop => this.props[prop] !== nextProps[prop], // eslint-disable-line react/destructuring-assignment
      )
    ) {
      shouldComputeScales = true;
    }
    if (
      ['margin', 'xScale', 'yScale'].some(
        // eslint-disable-next-line react/destructuring-assignment
        prop => !shallowCompareObjectEntries(this.props[prop], nextProps[prop]),
      )
    ) {
      shouldComputeScales = true;
    }
    if (shouldComputeScales) this.setState(XYChart.getStateFromProps(nextProps));
  }

  static getStateFromProps(props) {
    const { margin, innerWidth, innerHeight } = getChartDimensions(props);
    const { xScale, yScale } = collectScalesFromProps(props);
    const voronoiData = collectVoronoiData({
      children: props.children,
      getX,
      getY,
    });

    return {
      innerHeight,
      innerWidth,
      margin,
      xScale,
      yScale,
      voronoiData,
      voronoiX: d => xScale(getX(d)),
      voronoiY: d => yScale(getY(d)),
    };
  }

  getNumTicksAndGridValues(innerWidth, innerHeight) {
    const { children, xGridValues, yGridValues } = this.props;
    const xAxis = getChildWithName('XAxis', children);
    const yAxis = getChildWithName('YAxis', children);

    // use num ticks and tickValues defined on Axes, if relevant
    return {
      numXTicks: propOrFallback(xAxis && xAxis.props, 'numTicks', numTicksForWidth(innerWidth)),
      numYTicks: propOrFallback(yAxis && yAxis.props, 'numTicks', numTicksForHeight(innerHeight)),
      xGridValues:
        xGridValues ||
        (xAxis && xAxis.props && xAxis.props.tickValues ? xAxis.props.tickValues : null),
      yGridValues:
        yGridValues ||
        (yAxis && yAxis.props && yAxis.props.tickValues ? yAxis.props.tickValues : null),
    };
  }

  getDatumCoords(datum) {
    const { xScale, yScale, margin } = this.state;
    const coords = {};
    // tooltip operates in full width/height space so we must account for margins
    if (datum) coords.x = xScale(getX(datum)) + margin.left;
    if (datum) coords.y = yScale(getY(datum)) + margin.top;

    return coords;
  }

  handleContainerEvent(event) {
    const { xScale, yScale, margin } = this.state;
    const { children } = this.props;
    const { closestDatum, series } = findClosestDatums({
      children,
      event,
      getX,
      getY,
      xScale,
      yScale,
      margin,
    });
    if (closestDatum || Object.keys(series).length > 0) {
      event.persist();
      const args = { event, datum: closestDatum, series };
      if (event.type === 'mousemove') this.handleMouseMove(args);
      else if (event.type === 'click') this.handleClick(args);
    }
  }

  handleMouseDown(event) {
    if (this.fireBrushStart) {
      this.fireBrushStart(event);
    }
  }

  handleMouseMove(args) {
    const { snapTooltipToDataX, snapTooltipToDataY, onMouseMove } = this.props;
    const isFocusEvent = args.event && args.event.type === 'focus';

    if (onMouseMove) {
      const { x, y } = this.getDatumCoords(args.datum);
      onMouseMove({
        ...args,
        coords: {
          ...((isFocusEvent || snapTooltipToDataX) && { x }),
          ...((isFocusEvent || snapTooltipToDataY) && { y }),
          ...args.coords,
        },
      });
    }
  }

  handleMouseLeave(args) {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) onMouseLeave(args);
  }

  handleClick(args) {
    const { snapTooltipToDataX, snapTooltipToDataY, onClick } = this.props;

    if (onClick) {
      const coords = this.getDatumCoords(args.datum);
      onClick({
        ...args,
        coords: {
          x: snapTooltipToDataX ? coords.x : undefined,
          y: snapTooltipToDataY ? coords.y : undefined,
          ...args.coords,
        },
      });
    }
  }

  render() {
    const { renderTooltip } = this.props;
    if (renderTooltip) {
      return (
        <WithTooltip renderTooltip={renderTooltip}>
          <XYChart {...this.props} renderTooltip={null} />
        </WithTooltip>
      );
    }

    const {
      ariaLabel,
      eventTrigger,
      children,
      showXGrid,
      showYGrid,
      theme,
      height,
      width,
      innerRef,
      tooltipData,
      showVoronoi,
      xGridOffset,
      yGridOffset,
    } = this.props;

    const {
      innerWidth,
      innerHeight,
      margin,
      voronoiData,
      voronoiX,
      voronoiY,
      xScale,
      yScale,
    } = this.state;

    const { numXTicks, numYTicks, xGridValues, yGridValues } = this.getNumTicksAndGridValues(
      innerWidth,
      innerHeight,
    );
    const CrossHairs = []; // ensure these are the top-most layer
    let Brush = null;
    let xAxisOrientation;
    let yAxisOrientation;

    return (
      innerWidth > 0 &&
      innerHeight > 0 && (
        <svg aria-label={ariaLabel} role="img" width={width} height={height} ref={innerRef}>
          <Group left={margin.left} top={margin.top}>
            {showXGrid && (
              <GridColumns
                scale={xScale}
                height={innerHeight}
                numTicks={numXTicks}
                stroke={theme.gridStyles && theme.gridStyles.stroke}
                strokeWidth={theme.gridStyles && theme.gridStyles.strokeWidth}
                tickValues={xGridValues}
                offset={
                  isDefined(xGridOffset)
                    ? xGridOffset
                    : (xScale.bandwidth && xScale.bandwidth() / 2) || 0
                }
              />
            )}

            {showYGrid && (
              <GridRows
                scale={yScale}
                width={innerWidth}
                numTicks={numYTicks}
                stroke={theme.gridStyles && theme.gridStyles.stroke}
                strokeWidth={theme.gridStyles && theme.gridStyles.strokeWidth}
                tickValues={yGridValues}
                offset={
                  isDefined(yGridOffset)
                    ? yGridOffset
                    : (yScale.bandwidth && yScale.bandwidth() / 2) || 0
                }
              />
            )}

            {React.Children.map(children, Child => {
              const name = componentName(Child);
              if (isAxis(name)) {
                const styleKey = name[0].toLowerCase();
                const labelOffset =
                  typeof Child.props.labelOffset === 'number'
                    ? Child.props.labelOffset
                    : (name === 'YAxis' && Y_LABEL_OFFSET * margin[Child.props.orientation]) || 0;
                if (name === 'XAxis') {
                  xAxisOrientation = Child.props.orientation;
                } else {
                  yAxisOrientation = Child.props.orientation;
                }

                return React.cloneElement(Child, {
                  innerHeight,
                  innerWidth,
                  height,
                  width,
                  labelOffset,
                  numTicks: name === 'XAxis' ? numXTicks : numYTicks,
                  scale: name === 'XAxis' ? xScale : yScale,
                  rangePadding:
                    Child.props.rangePadding || (name === 'XAxis' ? xScale.offset : undefined),
                  axisStyles: {
                    ...theme[`${styleKey}AxisStyles`],
                    ...Child.props.axisStyles,
                  },
                  tickStyles: {
                    ...theme[`${styleKey}TickStyles`],
                    ...Child.props.tickStyles,
                  },
                });
              } else if (isSeries(name)) {
                return React.cloneElement(Child, {
                  xScale,
                  yScale,
                  margin,
                  onClick:
                    Child.props.onClick ||
                    (Child.props.disableMouseEvents ? undefined : this.handleClick),
                  onMouseLeave:
                    Child.props.onMouseLeave ||
                    (Child.props.disableMouseEvents ? undefined : this.handleMouseLeave),
                  onMouseMove:
                    Child.props.onMouseMove ||
                    (Child.props.disableMouseEvents ? undefined : this.handleMouseMove),
                });
              } else if (isCrossHair(name)) {
                CrossHairs.push(Child);

                return null;
              } else if (isReferenceLine(name)) {
                return React.cloneElement(Child, { xScale, yScale });
              } else if (isBrush(name)) {
                Brush = Child;

                return null;
              }

              return Child;
            })}

            {eventTrigger === VORONOI_TRIGGER && (
              <Voronoi
                data={voronoiData}
                x={voronoiX}
                y={voronoiY}
                width={innerWidth}
                height={innerHeight}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseLeave={this.handleMouseLeave}
                showVoronoi={showVoronoi}
              />
            )}

            {eventTrigger === CONTAINER_TRIGGER && (
              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
                fillOpacity={0}
                onMouseDown={this.handleMouseDown}
                onClick={this.handleContainerEvent}
                onMouseMove={this.handleContainerEvent}
                onMouseLeave={this.handleMouseLeave}
              />
            )}

            {Brush &&
              React.cloneElement(Brush, {
                xScale,
                yScale,
                innerHeight,
                innerWidth,
                margin,
                onMouseMove: this.handleContainerEvent,
                onMouseLeave: this.handleMouseLeave,
                onClick: this.handleContainerEvent,
                xAxisOrientation,
                yAxisOrientation,
              })}

            {tooltipData &&
              CrossHairs.length > 0 &&
              CrossHairs.map((CrossHair, i) =>
                React.cloneElement(CrossHair, {
                  key: `crosshair-${i}`, // eslint-disable-line react/no-array-index-key
                  datum: tooltipData.datum,
                  series: tooltipData.series,
                  getScaledX: d =>
                    xScale(getX(d) || 0) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0),
                  getScaledY: d =>
                    yScale(getY(d) || 0) + (yScale.bandwidth ? yScale.bandwidth() / 2 : 0),
                  xScale,
                  yScale,
                }),
              )}
          </Group>
        </svg>
      )
    );
  }
}

XYChart.propTypes = propTypes;
XYChart.defaultProps = defaultProps;
XYChart.displayName = 'XYChart';

export default XYChart;
