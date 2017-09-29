/* eslint class-methods-use-this: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import WithTooltip, { withTooltipPropTypes } from '../enhancer/WithTooltip';
import Layout from '../layout/atlasForce';
import Links from './Links';
import Nodes from './Nodes';
import Link from './Link';
import Node from './Node';

export const propTypes = {
  ...withTooltipPropTypes,
  ariaLabel: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  renderTooltip: PropTypes.func,
  animated: PropTypes.bool,
};

const defaultProps = {
  renderTooltip: null,
  animated: false,
  margin: {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
  },
};

class Network extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      graph: this.copyGraph(props.graph),
    };
    this.layout = new Layout({ animated: props.animated });
    this.layout.setGraph(props.graph);
    this.layout.layout({
      callback: (newGraph) => {
        this.setGraphState(newGraph);
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { graph, animated } = nextProps;
    if (
      this.props.graph.links !== graph.links
      || this.props.graph.nodes !== graph.nodes
    ) {
      this.layout.setGraph(graph);
      this.layout.setAnimated(animated);
      this.layout.layout({
        callback: (newGraph) => {
          this.setGraphState(newGraph);
        },
      });
    } else {
      this.setGraphState(graph);
    }
  }

  componentWillUnmount() {
    this.layout.clear();
  }

  setGraphState(graph) {
    const copiedGraph = this.copyGraph(graph);
    this.setState({
      graph: copiedGraph,
    });
  }

  copyGraph(graph) {
    const { width, height, margin } = this.props;
    const range = graph.nodes.reduce((minMax, node) => {
      return {
        x: {
          min: Math.min(minMax.x.min, node.x),
          max: Math.max(minMax.x.max, node.x),
        },
        y: {
          min: Math.min(minMax.y.min, node.y),
          max: Math.max(minMax.y.max, node.y),
        },
      };
    }, {
      x: {
        min: 999999,
        max: -999999,
      },
      y: {
        min: 999999,
        max: -999999,
      },
    });

    function xScale(x) {
      return ((range.x.max - x) / (range.x.max - range.x.min)) *
       (width - margin.left - margin.right) + margin.left;
    }

    function yScale(y) {
      return ((range.y.max - y) / (range.y.max - range.y.min)) *
       (height - margin.top - margin.bottom) + margin.top;
    }

    const nodes = graph.nodes.map(({ x, y, ...rest }, index) => ({
      x: xScale(x),
      y: yScale(y),
      ...rest,
      index,
    }));
    const links = graph.links.map((link, index) => ({
      ...link,
      sourceX: xScale(link.source.x),
      sourceY: yScale(link.source.y),
      targetX: xScale(link.target.x),
      targetY: yScale(link.target.y),
      index,
    }));
    return { nodes, links };
  }

  render() {
    const {
      ariaLabel,
      height,
      width,
      onNodeClick,
      onNodeMouseEnter,
      onNodeMouseLeave,
      renderNode,
      renderLink,
      renderTooltip,
    } = this.props;
    return (
      <WithTooltip renderTooltip={renderTooltip}>
        {({ onMouseMove, onMouseLeave: toolTipOnMouseLeave }) => (
          <svg
            aria-label={ariaLabel}
            role="img"
            width={width}
            height={height}
          >
            <Group>
              <Links
                links={this.state.graph.links}
                linkComponent={renderLink || Link}
              />
              <Nodes
                nodes={this.state.graph.nodes}
                nodeComponent={renderNode || Node}
                onMouseEnter={onNodeMouseEnter}
                onMouseLeave={(event) => {
                  if (onNodeMouseLeave) {
                    onNodeMouseLeave(event);
                  }
                  toolTipOnMouseLeave(event);
                }}
                onMouseMove={onMouseMove}
                onClick={onNodeClick}
              />
            </Group>
          </svg>
        )}
      </WithTooltip>
    );
  }

}

Network.defaultProps = defaultProps;
Network.propTypes = propTypes;

export default Network;
