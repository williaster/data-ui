/* eslint class-methods-use-this: 0 */
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

// @todo import this in storybook for 1x injection
import '../splitpane.css';

import AggregatePanel, { margin } from './AggregatePanel';
import SingleSequencePanel from './SingleSequencePanel';

import { buildGraph } from '../utils/graph-utils';
import { buildAllScales } from '../utils/scale-utils';
import { collectSequencesFromNode } from '../utils/data-utils';
import { dataShape, xScaleTypeShape, yScaleTypeShape } from '../propShapes';
import { ELAPSED_TIME_SCALE, EVENT_COUNT_SCALE, NODE_COLOR_SCALE } from '../constants';

const styles = StyleSheet.create({
  fillParent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  noPointerEvents: {
    pointerEvents: 'none',
  },
});

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
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleClearSelection = this.handleClearSelection.bind(this);

    const paneHeight = props.height - minPaneSize;
    const graph = this.getGraph(props);
    const scales = this.getScales({ graph, width: props.width, height: props.height });

    this.state = {
      paneHeight,
      selectedNode: null,
      graph,
      scales,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.props.data !== nextProps.data || this.props.alignBy !== nextProps.alignBy) {
      nextState.graph = this.getGraph(nextProps);
      nextState.selectedNode = null;
      nextState.paneHeight = nextProps.height - minPaneSize;
    }
    if (this.props.height !== nextProps.height) {
      nextState.paneHeight = this.state.paneHeight * (nextProps.height / this.props.height);
    }
    if (nextState.paneHeight || nextState.graph || this.props.width !== nextProps.width) {
      nextState.scales = this.getScales({
        graph: nextState.graph || this.state.graph,
        width: nextProps.width,
        height: nextProps.height,
      });
    }
    if (Object.keys(nextState).length > 0) {
      this.setState(nextState);
    }
  }

  onClickNode({ node }) {
    const { height } = this.props;
    const { selectedNode, graph } = this.state;
    const isSelected = selectedNode && selectedNode.id === node.id;
    const sequences = isSelected ? null : collectSequencesFromNode(node, graph.entityEvents);

    this.setState({
      selectedNode: isSelected ? null : node,
      selectedSequences: sequences,
      paneHeight: isSelected ?
        (height - minPaneSize) :
        Math.max(minPaneSize, height - (30 * sequences.length) - 75),
    });
  }

  getGraph(props) {
    const { data, alignBy } = props;
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

  handleDragStart() {
    this.setState({ dragging: true });
  }

  handleDragEnd(paneHeight) {
    this.setState({
      dragging: false,
      paneHeight: this.state.selectedNode ? paneHeight : this.state.paneHeight,
    });
  }

  handleClearSelection() {
    this.setState({
      selectedNode: null,
      selectedSequences: null,
      paneHeight: this.props.height - minPaneSize,
    });
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
      selectedSequences,
      selectedNode,
      paneHeight,
      scales,
      dragging,
    } = this.state;

    return (
      <div style={{ position: 'relative', width, height }}>
        <SplitPane
          split="horizontal"
          size={dragging ? undefined : paneHeight}
          minSize={minPaneSize}
          maxSize={height - minPaneSize}
          onDragStarted={this.handleDragStart}
          onDragFinished={this.handleDragEnd}
        >
          <div className={css(styles.fillParent, dragging && styles.noPointerEvents)}>
            <AggregatePanel
              graph={graph}
              xScale={scales[xScaleType]}
              yScale={scales[yScaleType]}
              colorScale={scales[NODE_COLOR_SCALE]}
              onClickNode={this.onClickNode}
              width={width}
              height={height}
            />
          </div>
          <div className={css(styles.fillParent)}>
            {selectedSequences &&
              <SingleSequencePanel
                node={selectedNode}
                sequences={selectedSequences}
                colorScale={scales[NODE_COLOR_SCALE]}
                width={width}
                clearSelection={this.handleClearSelection}
              />}
          </div>
        </SplitPane>
      </div>
    );
  }
}

Visualization.propTypes = propTypes;
Visualization.defaultProps = defaultProps;

export default Visualization;
