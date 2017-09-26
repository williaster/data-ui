import React from 'react';
import {
  Network,
  propTypes,
} from '@data-ui/network';

import { getAddedGraph } from './data';
import UserNode from './renderer/UserNode';
import AttributeNode from './renderer/AttributeNode';
import DirectedLink from './renderer/DirectedLink';

class NetworkWithCustimizedRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { graph: props.graph };
    this.onNodeClick = this.onNodeClick.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.renderLink = this.renderLink.bind(this);
  }

  onNodeClick({ index }) {
    const graph = this.state.graph;
    const newGraph = getAddedGraph(graph, graph.nodes[index]);
    this.setState({ graph: newGraph });
  }

  renderNode({ node, ...rest }) {
    const { onMouseEnter, onMouseLeave, onMouseMove, onClick } = rest;
    if (node.type == "User") {
      return (
        <UserNode
          node={node}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onClick={onClick}
        />
      );
    }

    return (
      <AttributeNode
        node={node}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onClick}
      />
    );
  }

  renderLink({ link, ...rest }) {
    return <DirectedLink link={link} />
  }

  render() {
    const { animated, ariaLabel, width, height, renderTooltip } = this.props;
    return (
      <Network
        renderTooltip={renderTooltip}
        width={width}
        height={height}
        animated={animated}
        ariaLabel={ariaLabel}
        graph={this.state.graph}
        onNodeClick={this.onNodeClick}
        onMouseLeave={this.onMouseLeave}
        renderNode={this.renderNode}
        renderLink={this.renderLink}
      />
    );
  }
}

export default NetworkWithCustimizedRenderer;
