/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import Graph from '../graph/Graph';
import { themeShape } from '../utils/propShapes';
import WithTooltip, { withTooltipPropTypes } from '../enhancer/WithTooltip';
import Node from './Node';
import Link from './Link';
import layout from '../layout/atlasForce';

export const propTypes = {
  ...withTooltipPropTypes,
  ariaLabel: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  layout: PropTypes.string,
  theme: themeShape,
  renderTooltip: PropTypes.func,
  animated: PropTypes.boolean,
};

const defaultProps = {
  layout: 'none',
  renderTooltip: null,
  theme: {},
  animated: false,
};

class Network extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      graph: this.copyGraph(props.graph),
    };
    layout({
      graph: props.graph,
      animated: props.animated,
      callback: (newGraph) => {
        this.setStateGraph(newGraph);
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { graph, animated } = nextProps;
    if (this.props.grpah !== graph) {
      layout({
        graph,
        animated,
        callback: (newGraph) => {
          this.setStateGraph(newGraph);
        },
      });
    }
  }

  setStateGraph(graph) {
    const copiedGraph = this.copyGraph(graph);
    this.setState({
      graph: copiedGraph,
    });
  }

  copyGraph(graph) {
    const nodes = graph.nodes.map((node, index) => ({
      ...node,
      index,
    }));
    const links = graph.links.map((link, index) => ({
      ...link,
      sourceX: link.source.x,
      sourceY: link.source.y,
      targetX: link.target.x,
      targetY: link.target.y,
      index,
    }));
    return { nodes, links };
  }

  render() {
    const {
      ariaLabel,
      height,
      width,
    } = this.props;
    return (
      <WithTooltip renderTooltip={this.props.renderTooltip}>
        {({ onMouseMove, onMouseLeave }) => (
          <svg
            aria-label={ariaLabel}
            role="img"
            width={width}
            height={height}
          >
            <Graph
              linkComponent={Link}
              nodeComponent={Node}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onNodeClick={this.props.onNodeClick}
              graph={this.state.graph}
            />
          </svg>
        )}
      </WithTooltip>
    );
  }

}

Network.defaultProps = defaultProps;
Network.propTypes = propTypes;

export default Network;
