import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

import AggregatePanel, { margin } from './AggregatePanel';
import SingleSequencesPanel from './SingleSequencesPanel';
import { collectSequencesFromNode } from '../utils/data-utils';
import { graphShape, scaleShape } from '../propShapes';

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

const MIN_PANE_SIZE = 25;

const propTypes = {
  graph: graphShape.isRequired,
  xScale: scaleShape.isRequired,
  yScale: scaleShape.isRequired,
  colorScale: scaleShape.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const defaultProps = {};

class Visualization extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickNode = this.onClickNode.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onClearSelection = this.onClearSelection.bind(this);

    this.state = {
      paneHeight: props.height - MIN_PANE_SIZE,
      selectedNode: null,
      selectedSequences: null,
      dragging: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const updateProps = ['xScale', 'yScale', 'graph'];
    if (updateProps.some(key => nextProps[key] !== this.props[key])) {
      this.setState({
        paneHeight: nextProps.height - MIN_PANE_SIZE,
        selectedNode: null,
        selectedSequences: null,
      });
    }
  }

  onClickNode({ node }) {
    const { height, graph } = this.props;
    const { selectedNode } = this.state;
    const isSelected = selectedNode && selectedNode.id === node.id;
    const sequences = isSelected ? null : collectSequencesFromNode(node, graph.entityEvents);

    this.setState({
      selectedNode: isSelected ? null : node,
      selectedSequences: sequences,
      paneHeight: isSelected ?
        (height - MIN_PANE_SIZE) :
        Math.max(MIN_PANE_SIZE, height - SingleSequencesPanel.getEstimatedHeight(sequences.length)),
    });
  }

  onDragStart() {
    this.setState({ dragging: true });
  }

  onDragEnd(paneHeight) {
    this.setState({
      dragging: false,
      paneHeight: this.state.selectedNode ? paneHeight : this.state.paneHeight,
    });
  }

  onClearSelection() {
    this.setState({
      selectedNode: null,
      selectedSequences: null,
      paneHeight: this.props.height - MIN_PANE_SIZE,
    });
  }

  render() {
    const {
      graph,
      xScale,
      yScale,
      colorScale,
      width,
      height,
    } = this.props;

    const {
      selectedSequences,
      selectedNode,
      paneHeight,
      dragging,
    } = this.state;

    return (
      <div style={{ position: 'relative', width, height }}>
        <SplitPane
          split="horizontal"
          size={dragging ? undefined : paneHeight}
          minSize={MIN_PANE_SIZE}
          maxSize={height - MIN_PANE_SIZE}
          onDragStarted={this.onDragStart}
          onDragFinished={this.onDragEnd}
        >
          <div className={css(styles.fillParent, dragging && styles.noPointerEvents)}>
            <AggregatePanel
              graph={graph}
              xScale={xScale}
              yScale={yScale}
              colorScale={colorScale}
              onClickNode={this.onClickNode}
              width={width}
              height={height}
            />
          </div>
          <div className={css(styles.fillParent)}>
            {selectedSequences && selectedNode &&
              <SingleSequencesPanel
                node={selectedNode}
                sequences={selectedSequences}
                colorScale={colorScale}
                width={width}
                height={height}
                clearSelection={this.onClearSelection}
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

export { margin };
