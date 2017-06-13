import { Group } from '@vx/group';
import React from 'react';
import PropTypes from 'prop-types';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { event as d3Event, select as d3Select } from 'd3-selection';

import { buildGraph } from '../utils/graph-utils';
import { dataShape } from '../propShapes';
import {
  buildAllScales,
  scaleAccessors,
  scaleLabels,
  timeUnitFromTimeExtent,
} from '../utils/scale-utils';

import {
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  NODE_SEQUENCE_SCALE,
  NODE_COLOR_SCALE,
} from '../constants';

import SubTree from './SubTree';
import Tooltip from './Tooltip';
import XAxis from './XAxis';
import YAxis from './YAxis';
import ZeroLine from './ZeroLine';

const margin = {
  top: XAxis.height,
  right: 30,
  bottom: 30,
  left: YAxis.width,
};

const propTypes = {
  alignBy: PropTypes.func,
  xScaleType: PropTypes.oneOf([ELAPSED_TIME_SCALE, EVENT_SEQUENCE_SCALE]),
  yScaleType: PropTypes.oneOf([EVENT_COUNT_SCALE, NODE_SEQUENCE_SCALE]),
  data: dataShape,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zoomScaleExtent: PropTypes.arrayOf(PropTypes.number),
};

const defaultProps = {
  data: [],
  alignBy: (/* events */) => 0,
  zoomScaleExtent: [1, 40],
  xScaleType: ELAPSED_TIME_SCALE,
  yScaleType: EVENT_COUNT_SCALE,
};

class Visualization extends React.PureComponent {
  static clearedState() {
    return {
      xScaleZoomed: null,
      yScaleZoomed: null,
      viewTransform: null,
      tooltip: null,
    };
  }

  constructor(props) {
    super(props);
    this.getGraph = this.getGraph.bind(this);
    this.getScales = this.getScales.bind(this);
    this.panOrZoom = this.panOrZoom.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);

    this.zoom = d3Zoom()
      .scaleExtent(props.zoomScaleExtent)
      .on('zoom', this.panOrZoom);

    const graph = this.getGraph(props);
    const scales = this.getScales(graph, props);

    this.state = {
      ...Visualization.clearedState(),
      scales,
      graph,
    };
  }

  componentDidMount() {
    this.zoom(d3Select(this.svg)); // this attaches all zoom-related listeners to the view ref
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.data !== nextProps.data ||
      this.props.alignBy !== nextProps.alignBy
    ) {
      const graph = this.getGraph(nextProps);
      const scales = this.getScales(graph, nextProps);
      this.setState({
        ...(Visualization.clearedState()),
        graph,
        scales,
      });
    } else if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this.setState({
        ...Visualization.clearedState(),
        scales: this.getScales(this.state.graph, nextProps),
      });
    }
  }

  onClick({ node, event, coords }) {
    console.log('over', { node, event, coords });
    // @todo single event pane
  }
  onMouseOver({ node, link, event, coords }) {
    console.log('over', { node, link, event, coords });
    this.setState({
      tooltip: { coords, node, link },
    });
  }

  onMouseOut() {
    this.setState({ tooltip: null });
  }

  getGraph(props) {
    console.time('graph');
    const { data, alignBy } = props || this.props;
    const graph = buildGraph(data, alignBy);
    console.timeEnd('graph');
    return graph;
  }

  getScales(graph, props) {
    console.time('scales');
    const innerWidth = (props || this.props).width - margin.left - margin.right;
    const innerHeight = (props || this.props).height - margin.top - margin.bottom;
    const scales = buildAllScales(graph, innerWidth, innerHeight);

    // reset the current zoom
    this.zoom.translateExtent([[0, 0], [innerWidth, innerHeight]]);
    this.zoom.extent([[0, 0], [innerWidth, innerHeight]]);
    if (this.svg) {
      this.zoom.transform(d3Select(this.svg), zoomIdentity);
    }
    console.timeEnd('scales');
    return scales;
  }

  panOrZoom() {
    const { xScaleType, yScaleType } = this.props;
    const { scales, viewTransform: currViewTransform } = this.state;

    const viewTransform = d3Event.transform.toString();

    if (viewTransform !== currViewTransform) {
      this.setState({
        xScaleZoomed: d3Event.transform.rescaleX(scales[xScaleType]),
        yScaleZoomed: d3Event.transform.rescaleY(scales[yScaleType]),
        viewTransform,
        tooltip: null,
      });
    }
  }

  render() {
    const {
      width,
      height,
      xScaleType,
      yScaleType,
    } = this.props;

    const {
      graph,
      scales,
      xScaleZoomed,
      yScaleZoomed,
      viewTransform,
      tooltip,
    } = this.state;

    const xScale = scales[xScaleType];
    const yScale = scales[yScaleType];
    const innerWidth = Math.max(...xScale.range());
    const innerHeight = Math.max(...yScale.range());
    console.log(graph);

    return xScale && yScale ? (
      <div style={{ position: 'relative' }}>
        <svg
          role="img"
          aria-label="Event flow"
          width={width}
          height={height}
          ref={(ref) => { this.svg = ref; }}
          style={{ cursor: 'move' }}
        >
          <Group
            top={margin.top}
            left={margin.left}
          >
            <defs>
              <clipPath id="clip">
                <rect x={-2} width={innerWidth + margin.right + 2} height={innerHeight} />
              </clipPath>
            </defs>
            <YAxis
              scale={yScaleZoomed || yScale}
              label={scaleLabels[yScaleType]}
              labelOffset={margin.left * 0.6}
              width={innerWidth}
            />
            <g clipPath="url(#clip)">
              <g transform={viewTransform}>
                <SubTree
                  nodes={graph.root.children}
                  xScale={xScale}
                  yScale={yScale}
                  colorScale={scales[NODE_COLOR_SCALE]}
                  getX={scaleAccessors[xScaleType]}
                  getY={scaleAccessors[yScaleType]}
                  getColor={scaleAccessors[NODE_COLOR_SCALE]}
                  onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  onClick={this.onClick}
                />
                <ZeroLine xScale={xScale} yScale={yScale} />
              </g>
            </g>
            <XAxis
              scale={xScaleZoomed || xScale}
              label={scaleLabels[xScaleType]}
              labelOffset={margin.top * 0.6}
              height={innerHeight}
              timeUnit={
                xScaleType === ELAPSED_TIME_SCALE ?
                timeUnitFromTimeExtent((xScaleZoomed || xScale).domain())
                : null
              }
            />
          </Group>
        </svg>
        {tooltip &&
          <Tooltip
            svg={this.svg}
            node={tooltip.node}
            link={tooltip.link}
            x={xScaleZoomed ? xScaleZoomed(xScale.invert(tooltip.coords.x)) : tooltip.coords.x}
            y={yScaleZoomed ? yScaleZoomed(yScale.invert(tooltip.coords.y)) : tooltip.coords.y}
            colorScale={scales[NODE_COLOR_SCALE]}
            getColor={scaleAccessors[NODE_COLOR_SCALE]}
          />}
      </div>
    ) : null;
  }
}

Visualization.propTypes = propTypes;
Visualization.defaultProps = defaultProps;

export default Visualization;
