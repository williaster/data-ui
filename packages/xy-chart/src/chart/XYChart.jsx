import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@vx/grid/build/grids/Grid';
import Group from '@vx/group/build/Group';
import WithTooltip, { withTooltipPropTypes } from '@data-ui/shared/build/enhancer/WithTooltip';

import collectVoronoiData from '../utils/collectVoronoiData';
import findClosestDatums from '../utils/findClosestDatums';
import shallowCompareObjectEntries from '../utils/shallowCompareObjectEntries';
import Voronoi from './Voronoi';

import {
  componentName,
  isAxis,
  isCrossHair,
  isReferenceLine,
  isSeries,
  getChildWithName,
  numTicksForWidth,
  numTicksForHeight,
  propOrFallback,
} from '../utils/chartUtils';

import collectScalesFromProps from '../utils/collectScalesFromProps';
import getChartDimensions from '../utils/getChartDimensions';
import { scaleShape, themeShape } from '../utils/propShapes';

export const CONTAINER_TRIGGER = 'container';
export const SERIES_TRIGGER = 'series';
export const VORONOI_TRIGGER = 'voronoi';

export const propTypes = {
  ...withTooltipPropTypes,
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
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
  showYGrid: PropTypes.bool,
  showVoronoi: PropTypes.bool,
  snapTooltipToDataX: PropTypes.bool,
  snapTooltipToDataY: PropTypes.bool,
  theme: themeShape,
  width: PropTypes.number.isRequired,
  xScale: scaleShape.isRequired,
  yScale: scaleShape.isRequired,
};

export const defaultProps = {
  children: null,
  disableMouseEvents: false,
  eventTrigger: SERIES_TRIGGER,
  eventTriggerRefs: null,
  innerRef: null,
  margin: {
    top: 64,
    right: 64,
    bottom: 64,
    left: 64,
  },
  renderTooltip: null,
  showVoronoi: false,
  showXGrid: false,
  showYGrid: false,
  snapTooltipToDataX: false,
  snapTooltipToDataY: false,
  styles: null,
  theme: {},
};

// accessors
const getX = d => d && d.x;
const getY = d => d && d.y;

class XYChart extends React.PureComponent {
  static getStateFromProps(props) {
    const { margin, innerWidth, innerHeight } = getChartDimensions(props);
    const { xScale, yScale } = collectScalesFromProps(props);
    const voronoiData = collectVoronoiData({ children: props.children, getX, getY });

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

  constructor(props) {
    super(props);
    // if renderTooltip is passed we return another XYChart wrapped in WithTooltip
    // therefore we don't want to compute state if the nested chart will do so
    this.state = props.renderTooltip ? {} : XYChart.getStateFromProps(props);

    this.getDatumCoords = this.getDatumCoords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleContainerEvent = this.handleContainerEvent.bind(this);
  }

  componentDidMount() {
    if (!this.props.renderTooltip && this.props.eventTriggerRefs) {
      this.props.eventTriggerRefs({
        mousemove: this.handleMouseMove,
        mouseleave: this.handleMouseLeave,
        click: this.handleClick,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let shouldComputeScales = false;
    if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      shouldComputeScales = true;
    }
    if ([
      'margin',
      'xScale',
      'yScale',
    ].some(prop => !shallowCompareObjectEntries(this.props[prop], nextProps[prop]))) {
      shouldComputeScales = true;
    }
    if (shouldComputeScales) this.setState(XYChart.getStateFromProps(nextProps));
  }

  getNumTicks(innerWidth, innerHeight) {
    const xAxis = getChildWithName('XAxis', this.props.children);
    const yAxis = getChildWithName('YAxis', this.props.children);
    return {
      numXTicks: propOrFallback(xAxis && xAxis.props, 'numTicks', numTicksForWidth(innerWidth)),
      numYTicks: propOrFallback(yAxis && yAxis.props, 'numTicks', numTicksForHeight(innerHeight)),
    };
  }

  getDatumCoords(datum) {
    const { snapTooltipToDataX, snapTooltipToDataY } = this.props;
    const { xScale, yScale, margin } = this.state;
    const coords = {};
    // tooltip operates in full width/height space so we must account for margins
    if (datum && snapTooltipToDataX) coords.x = xScale(getX(datum)) + margin.left;
    if (datum && snapTooltipToDataY) coords.y = yScale(getY(datum)) + margin.top;
    return coords;
  }

  handleContainerEvent(event) {
    const { xScale, yScale } = this.state;
    const { children } = this.props;
    const { closestDatum, series } = findClosestDatums({
      children,
      event,
      getX,
      getY,
      xScale,
      yScale,
    });

    if (closestDatum || Object.keys(series).length > 0) {
      event.persist();
      const args = { event, datum: closestDatum, series };
      if (event.type === 'mousemove') this.handleMouseMove(args);
      else if (event.type === 'click') this.handleClick(args);
    }
  }

  handleMouseMove(args) {
    if (this.props.onMouseMove) {
      this.props.onMouseMove({
        ...args,
        coords: {
          ...this.getDatumCoords(args.datum),
          ...args.coords,
        },
      });
    }
  }

  handleMouseLeave(args) {
    if (this.props.onMouseLeave) this.props.onMouseLeave(args);
  }

  handleClick(args) {
    if (this.props.onClick) {
      this.props.onClick({
        ...args,
        coords: {
          ...this.getDatumCoords(args.datum),
          ...args.coords,
        },
      });
    }
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

    const { numXTicks, numYTicks } = this.getNumTicks(innerWidth, innerHeight);
    const barWidth = xScale.barWidth || (xScale.bandwidth && xScale.bandwidth()) || 0;
    const CrossHairs = []; // ensure these are the top-most layer
    return innerWidth > 0 && innerHeight > 0 && (
      <svg
        aria-label={ariaLabel}
        role="img"
        width={width}
        height={height}
        ref={innerRef}
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
                onClick: Child.props.onClick
                  || (Child.props.disableMouseEvents ? undefined : this.handleClick),
                onMouseLeave: Child.props.onMouseLeave
                  || (Child.props.disableMouseEvents ? undefined : this.handleMouseLeave),
                onMouseMove: Child.props.onMouseMove
                  || (Child.props.disableMouseEvents ? undefined : this.handleMouseMove),
              });
            } else if (isCrossHair(name)) {
              CrossHairs.push(Child);
              return null;
            } else if (isReferenceLine(name)) {
              return React.cloneElement(Child, { xScale, yScale });
            }
            return Child;
          })}

          {eventTrigger === VORONOI_TRIGGER &&
            <Voronoi
              data={voronoiData}
              x={voronoiX}
              y={voronoiY}
              width={innerWidth}
              height={innerHeight}
              onClick={this.handleClick}
              onMouseMove={this.handleMouseMove}
              onMouseLeave={this.handleMouseLeave}
              showVoronoi={showVoronoi}
            />}

          {eventTrigger === CONTAINER_TRIGGER &&
            <rect
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              fillOpacity={0}
              onClick={this.handleContainerEvent}
              onMouseMove={this.handleContainerEvent}
              onMouseLeave={this.handleMouseLeave}
            />}

          {tooltipData && CrossHairs.length > 0 && CrossHairs.map((CrossHair, i) => (
            React.cloneElement(CrossHair, {
              key: `crosshair-${i}`, // eslint-disable-line react/no-array-index-key
              left: (
                xScale(getX(tooltipData.datum) || 0)
                + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0)
              ),
              top: yScale(getY(tooltipData.datum) || 0),
              xScale,
              yScale,
            })
          ))}
        </Group>
      </svg>
    );
  }
}

XYChart.propTypes = propTypes;
XYChart.defaultProps = defaultProps;
XYChart.displayName = 'XYChart';

export default XYChart;
