/* esline class-methods-use-this: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

// @todo import this in storybook for 1x injection
import '../splitpane.css';

import AggregatePanel, { margin } from './AggregatePanel';
import SingleSequencePanel from './SingleSequencePanel';

import { buildGraph } from '../utils/graph-utils';
import { buildAllScales } from '../utils/scale-utils';
import { dataShape, xScaleTypeShape, yScaleTypeShape } from '../propShapes';
import { ELAPSED_TIME_SCALE, EVENT_COUNT_SCALE, NODE_COLOR_SCALE } from '../constants';

const minPaneSize = 15;

const propTypes = {
  alignBy: PropTypes.func,
  data: dataShape,
  xScaleType: xScaleTypeShape,
  yScaleType: yScaleTypeShape,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const defaultProps = {
  data: [],
  alignBy: (/* events */) => 0,
  xScaleType: ELAPSED_TIME_SCALE,
  yScaleType: EVENT_COUNT_SCALE,
};

class Visualization extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickNode = this.onClickNode.bind(this);
    this.getGraph = this.getGraph.bind(this);
    this.onPaneResizeStarted = this.onPaneResizeStarted.bind(this);
    this.onPaneResizeFinished = this.onPaneResizeFinished.bind(this);

    const paneHeight = props.height - minPaneSize;
    const graph = this.getGraph(props);
    const scales = this.getScales({ graph, width: props.width, height: paneHeight });

    this.state = {
      paneHeight,
      paneFraction: paneHeight / props.height,
      selectedNodes: {},
      graph,
      scales,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.props.data !== nextProps.data || this.props.alignBy !== nextProps.alignBy) {
      nextState.graph = this.getGraph(nextProps);
    }
    if (this.props.height !== nextProps.height) {
      nextState.paneHeight = nextProps.height * this.state.paneFraction;
    }
    if (nextState.paneHeight || nextState.graph || this.props.width !== nextProps.width) {
      nextState.scales = this.getScales({
        graph: nextState.graph || this.state.graph,
        width: nextProps.width,
        height: nextState.paneHeight || this.state.paneHeight,
      });
    }
    if (Object.keys(nextState).length > 0) {
      this.setState(nextState);
    }
  }

  onClickNode({ node }) {
    this.setState((prevState) => {
      const { selectedNodes } = prevState;
      const isSelected = Boolean(selectedNodes[node.id]);
      const nextSelectedNodes = {
        ...selectedNodes,
        [node.id]: isSelected ? null : node,
      };
      return {
        selectedNodes: nextSelectedNodes,
        force: Object.keys(nextSelectedNodes).length > 0,
      };
    });
  }

  onPaneResizeStarted() {
    this.setState({ dragging: true });
  }

  onPaneResizeFinished(nextHeight) {
    const { width, height } = this.props;
    this.setState({
      paneHeight: nextHeight,
      paneFraction: nextHeight / height,
      scales: this.getScales({ graph: this.state.graph, width, height: nextHeight }),
      dragging: false,
    });
  }

  getGraph(props) {
    const { data, alignBy } = props || this.props;
    const graph = buildGraph(data, alignBy);
    return graph;
  }

  getScales({ graph, width, height }) {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    console.time('buildScales');
    const scales = buildAllScales(graph, innerWidth, innerHeight);
    console.timeEnd('buildScales');
    return scales;
  }

  render() {
    const {
      xScaleType,
      yScaleType,
      width,
      height,
    } = this.props;

    const {
      graph,
      selectedNodes,
      paneHeight,
      scales,
      force,
      dragging,
    } = this.state;

    const selected = Object.keys(selectedNodes).length > 0 ? selectedNodes : null;

    return (
      <div style={{ position: 'relative', width, height }}>
        <SplitPane
          split="horizontal"
          defaultSize={force ? 0.65 * paneHeight : paneHeight}
          minSize={minPaneSize}
          maxSize={height - minPaneSize}
          onDragStarted={this.onPaneResizeStarted}
          onDragFinished={this.onPaneResizeFinished}
        >
          <AggregatePanel
            graph={graph}
            xScale={scales[xScaleType]}
            yScale={scales[yScaleType]}
            colorScale={scales[NODE_COLOR_SCALE]}
            onClickNode={this.onClickNode}
            selectedNodes={selected}
            width={width}
            height={paneHeight}
          />
          <div style={{ width: '100%', heigth: '100%', opacity: dragging ? 0 : 1 }}>
            <SingleSequencePanel
              nodes={selected}
              entityEvents={graph.entityEvents}
              colorScale={scales[NODE_COLOR_SCALE]}
              width={width}
            />
          </div>
        </SplitPane>
      </div>
    );
  }
}

Visualization.propTypes = propTypes;
Visualization.defaultProps = defaultProps;

export default Visualization;
