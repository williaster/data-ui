/* eslint class-methods-use-this: 0 */
import { Network, networkPropTypes } from '@data-ui/network';
import React from 'react';

import { expandGraph } from './data';
import UserNode from './renderer/UserNode';
import AttributeNode from './renderer/AttributeNode';
import DirectedLink from './renderer/DirectedLink';

class NetworkWithCustomizedRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { graph: props.graph };
    this.onClick = this.onClick.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.renderLink = this.renderLink.bind(this);
  }

  onClick({ index }) {
    const graph = this.state.graph;
    const newGraph = expandGraph(graph, graph.nodes[index]);
    this.setState(() => ({ graph: newGraph }));
  }

  renderNode(props) {
    const { node, onMouseMove, onMouseEnter, onMouseLeave, onClick } = props;
    if (node.type === 'User') {
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

  renderLink({ link }) {
    return <DirectedLink link={link} />;
  }

  render() {
    const { animated, ariaLabel, width, height, renderTooltip, margin } = this.props;
    return (
      <Network
        renderTooltip={renderTooltip}
        width={width}
        height={height}
        margin={margin}
        animated={animated}
        ariaLabel={ariaLabel}
        graph={this.state.graph}
        onClick={this.onClick}
        renderNode={this.renderNode}
        renderLink={this.renderLink}
      />
    );
  }
}

NetworkWithCustomizedRenderer.propTypes = {
  ...networkPropTypes,
};

export default NetworkWithCustomizedRenderer;
