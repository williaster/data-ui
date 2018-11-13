import React from 'react';
import { Network, networkPropTypes as propTypes } from '@data-ui/network';

import { expandGraph } from './data';

class ExpandableNetwork extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { graph: props.graph };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick({ index }) {
    const { graph } = this.state;
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
        onClick={this.handleClick}
        preserveAspectRatio={false}
      />
    );
  }
}

ExpandableNetwork.propTypes = propTypes;

export default ExpandableNetwork;
