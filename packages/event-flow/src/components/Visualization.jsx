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

// import GraphLayout from './GraphLayout';
import SubTree from './SubTree';
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
  data: dataShape,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zoomScaleExtent: PropTypes.arrayOf(PropTypes.number),
};

const defaultProps = {
  data: [],
  alignBy: (/* events */) => 0,
  zoomScaleExtent: [1, 40],
};

class Visualization extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getGraph = this.getGraph.bind(this);
    this.getScales = this.getScales.bind(this);
    this.panOrZoom = this.panOrZoom.bind(this);
    this.zoom = d3Zoom().scaleExtent(props.zoomScaleExtent).on('zoom', this.panOrZoom);

    const graph = this.getGraph(props);
    const scales = this.getScales(graph, props);

    this.state = {
      xScaleKey: ELAPSED_TIME_SCALE,
      yScaleKey: EVENT_COUNT_SCALE,
      viewTransform: null,
      scales,
      graph,
    };
  }

  componentDidMount() {
    this.zoom(d3Select(this.view)); // this attaches all zoom-related listeners to the view ref
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.data !== nextProps.data ||
      this.props.alignBy !== nextProps.alignBy
    ) {
      const graph = this.getGraph(nextProps);
      const scales = this.getScales(graph, nextProps);
      this.setState({
        graph,
        scales,
        xScaleZoomed: null,
        yScaleZoomed: null,
        viewTransform: null,
      });
    } else if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this.setState({
        scales: this.getScales(this.state.graph, nextProps),
        xScaleZoomed: null,
        yScaleZoomed: null,
        viewTransform: null,
      });
    }
  }

  getGraph(props) {
    const { data, alignBy } = props || this.props;
    console.time('graph');
    const graph = buildGraph(data, alignBy);
    console.timeEnd('graph');
    return graph;
  }

  getScales(graph, props) {
    const innerWidth = (props || this.props).width - margin.left - margin.right;
    const innerHeight = (props || this.props).height - margin.top - margin.bottom;
    console.time('scales');
    const scales = buildAllScales(graph, innerWidth, innerHeight);
    this.zoom.translateExtent([[0, 0], [innerWidth, innerHeight]]);
    this.zoom.extent([[0, 0], [innerWidth, innerHeight]]);
    if (this.view) {
      this.zoom.transform(d3Select(this.view), zoomIdentity);
    }
    console.timeEnd('scales');
    return scales;
  }

  panOrZoom() {
    const {
      scales,
      xScaleKey,
      yScaleKey,
      viewTransform: currViewTransform,
    } = this.state;

    const viewTransform = d3Event.transform.toString();

    if (viewTransform !== currViewTransform) {
      this.setState({
        xScaleZoomed: d3Event.transform.rescaleX(scales[xScaleKey]),
        yScaleZoomed: d3Event.transform.rescaleY(scales[yScaleKey]),
        viewTransform,
      });
    }
  }

  render() {
    const { width, height } = this.props;
    const {
      graph,
      scales,
      xScaleKey,
      yScaleKey,
      xScaleZoomed,
      yScaleZoomed,
      viewTransform,
    } = this.state;

    const xScale = scales[xScaleKey];
    const yScale = scales[yScaleKey];
    const innerWidth = Math.max(...xScale.range());
    const innerHeight = Math.max(...yScale.range());
    console.log(graph);
    return xScale && yScale ? (
      <svg
        role="img"
        aria-label="Event flow"
        width={width}
        height={height}
        ref={(ref) => { this.view = ref; }}
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
            label={scaleLabels[yScaleKey]}
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
                getX={scaleAccessors[xScaleKey]}
                getY={scaleAccessors[yScaleKey]}
                getColor={scaleAccessors[NODE_COLOR_SCALE]}
              />
              <ZeroLine xScale={xScale} yScale={yScale} />
            </g>
          </g>
          {/* Axes should use a 'zoomed' */}
          <XAxis
            scale={xScaleZoomed || xScale}
            label={scaleLabels[xScaleKey]}
            labelOffset={margin.top * 0.6}
            height={innerHeight}
            timeUnit={
              xScaleKey === ELAPSED_TIME_SCALE ?
              timeUnitFromTimeExtent((xScaleZoomed || xScale).domain())
              : null
            }
          />
        </Group>
      </svg>
    ) : null;
  }
}

Visualization.propTypes = propTypes;
Visualization.defaultProps = defaultProps;

export default Visualization;
