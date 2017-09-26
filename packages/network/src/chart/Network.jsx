/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { themeShape } from '../utils/propShapes';
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
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  layout: PropTypes.string,
  theme: themeShape,
  renderTooltip: PropTypes.func,
  animated: PropTypes.bool,
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
    this.layout = new Layout({ animated: props.animated });
    this.layout.setGraph(props.graph);
    this.layout.layout({
      callback: (newGraph) => {
        this.setStateGraph(newGraph);
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { graph, animated } = nextProps;
    if (this.props.graph.links !== graph.links ||
      this.props.graph.nodes !== graph.nodes) {
      this.layout.setGraph(graph);
      this.layout.setAnimated(animated);
      this.layout.layout({
        callback: (newGraph) => {
          this.setStateGraph(newGraph);
        },
      });
    } else {
      this.setStateGraph(graph);
    }
  }

  componentWillUnmount() {
    this.layout.clear();
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
      onNodeClick,
      onMouseEnter,
      onMouseLeave,
      renderNode,
      renderLink,
    } = this.props;
    return (
      <WithTooltip renderTooltip={this.props.renderTooltip}>
        {({ onMouseMove, onMouseLeave: toolTiponMouseLeave }) => (
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
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
              />
              <Nodes
                nodes={this.state.graph.nodes}
                nodeComponent={renderNode || Node}
                onMouseEnter={onMouseEnter}
                onMouseLeave={(event) => {
                  onMouseLeave(event);
                  toolTiponMouseLeave(event);
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
