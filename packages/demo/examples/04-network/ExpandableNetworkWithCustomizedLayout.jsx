import React from 'react';
import { Network, propTypes, AtlasForceDirectedLayout } from '@data-ui/network';

import Range from '../shared/Range';
import { expandGraph } from './data';

class ExpandableNetworkWithCustomizedLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { graph: props.graph, alpha: 0.5 };
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onSetAlpha = this.onSetAlpha.bind(this);

    this.layout = new AtlasForceDirectedLayout();
    this.layout.setNodeStrength(-100);
    this.layout.setCollideRadius(20);
    this.layout.setNodeMinDistance(20);
  }

  onSetAlpha(e) {
    const alpha = Number(e.target.value);
    const initialGraph = this.props.graph;
    const isInitialGraph = this.state.graph === initialGraph;
    const nextGraph = isInitialGraph
      ? expandGraph(initialGraph, initialGraph.nodes[0]) : initialGraph;

    this.layout.setAlphaMin(alpha);
    this.setState({ alpha, graph: nextGraph });
  }

  onNodeClick({ index }) {
    const graph = this.state.graph;
    const newGraph = expandGraph(graph, graph.nodes[index]);
    this.setState(() => ({ graph: newGraph }));
  }

  render() {
    const { animated, ariaLabel, width, height, renderTooltip, margin } = this.props;
    const { alpha } = this.state;
    const iterations = Math.ceil(Math.log(alpha) / Math.log(1 - 0.0228));

    return (
      <div>
        <Range
          id="data-ui-network-alpha"
          label={`Alpha min (${alpha.toFixed(3)}, ~${iterations} iterations)`}
          min={0.001}
          max={0.5}
          step={0.001}
          value={alpha}
          onMouseUp={this.onSetAlpha}
        />
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
      </div>
    );
  }
}

ExpandableNetworkWithCustomizedLayout.propTypes = propTypes;

export default ExpandableNetworkWithCustomizedLayout;
