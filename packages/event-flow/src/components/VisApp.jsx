import { Group } from '@vx/group';
import React from 'react';
import PropTypes from 'prop-types';

import { buildGraph } from '../utils/graph-utils';
import { buildAllScales, scaleAccessors, scaleLabels } from '../utils/scale-utils';
import { dataShape } from '../propShapes';

import {
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  // NODE_SEQUENCE_SCALE,
  NODE_COLOR_SCALE,
} from '../constants';

import GraphLayout from './GraphLayout';
import XAxis from './XAxis';
import YAxis from './YAxis';

const margin = {
  top: XAxis.height,
  right: 30,
  bottom: 30,
  left: YAxis.width,
};

const propTypes = {
  data: dataShape,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const defaultProps = {
  data: [],
};

class VisApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getGraph = this.getGraph.bind(this);
    this.getScales = this.getScales.bind(this);

    const graph = this.getGraph(props);
    const scales = this.getScales(graph, props);

    this.state = {
      xScaleKey: ELAPSED_TIME_SCALE,
      yScaleKey: EVENT_COUNT_SCALE,
      scales,
      graph,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const graph = this.getGraph(nextProps);
      const scales = this.getScales(graph, nextProps);
      this.setState({ graph, scales });
    } else if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this.setState({
        scales: this.getScales(this.state.graph, nextProps),
      });
    }
  }

  getGraph(props) {
    const { data } = props || this.props;
    console.time('graph');
    const graph = buildGraph(data);
    console.timeEnd('graph');
    return graph;
  }

  getScales(graph, props) {
    const innerWidth = (props || this.props).width - margin.left - margin.right;
    const innerHeight = (props || this.props).height - margin.top - margin.bottom;
    console.time('scales');
    const scales = buildAllScales(graph, innerWidth, innerHeight);
    console.timeEnd('scales');
    return scales;
  }

  render() {
    const { width, height } = this.props;
    const {
      graph,
      scales,
      xScaleKey,
      yScaleKey,
    } = this.state;
    console.log(graph);
    const xScale = scales[xScaleKey];
    const yScale = scales[yScaleKey];
    debugger;
    return xScale && yScale ? (
      <svg
        role="img"
        aria-label="Event flow"
        width={width}
        height={height}
      >
        <Group top={margin.top} left={margin.left}>
          <XAxis
            scale={xScale}
            label={scaleLabels[xScaleKey]}
            labelOffset={margin.top * 0.6}
            height={Math.max(yScale.range())}
            timeUnit={xScaleKey === ELAPSED_TIME_SCALE ? 'minute' : null}
          />
          <YAxis
            scale={yScale}
            label={scaleLabels[yScaleKey]}
            labelOffset={margin.left * 0.6}
            width={Math.max(xScale.range())}
          />
          <GraphLayout
            graph={graph}
            xScale={xScale}
            yScale={yScale}
            fillScale={scales[NODE_COLOR_SCALE]}
            x={scaleAccessors[xScaleKey]}
            y={scaleAccessors[yScaleKey]}
            fill={scaleAccessors[NODE_COLOR_SCALE]}
          />
        </Group>
      </svg>
    ) : null;
  }
}

VisApp.propTypes = propTypes;
VisApp.defaultProps = defaultProps;

export default VisApp;
