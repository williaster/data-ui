import React from 'react';
import { Network, propTypes, AtlasForceDirectedLayout } from '@data-ui/network';

import { expandGraph } from './data';

class ExpandableNetworkWithCustomizedLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { graph: props.graph };
    this.onNodeClick = this.onNodeClick.bind(this);
    this.layout = new AtlasForceDirectedLayout();
    this.layout.setNodeStrength(-100);
    this.layout.setCollideRadius(20);
    this.layout.setNodeMinDistance(20);
  }

  onNodeClick({ index }) {
    const graph = this.state.graph;
    const newGraph = expandGraph(graph, graph.nodes[index]);
    this.setState(() => ({ graph: newGraph }));
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
        onNodeClick={this.onNodeClick}
        layout={this.layout}
      />
    );
  }
}

ExpandableNetworkWithCustomizedLayout.propTypes = propTypes;

export default ExpandableNetworkWithCustomizedLayout;
