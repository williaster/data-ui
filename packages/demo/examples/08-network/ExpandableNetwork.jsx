/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
// import PropTypes from 'prop-types';
import React from 'react';
import {
  Network,
} from '@data-ui/network';


class ExpandableNetwork extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = this.getStateFromProps(props);
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  onNodeClick({ index }) {
    const node = this.state.graph.nodes[index];
    const nodes = [
      {
        x: 300,
        y: 200,
        id: 1237,
        size: 10,
      },
      {
        x: 400,
        y: 200,
        id: 1238,
        size: 10,
      },
      {
        x: 200,
        y: 400,
        id: 1239,
        size: 15,
      },
    ];

    const links = [
      {
        source: node,
        target: nodes[0],
      },
      {
        source: node,
        target: nodes[1],
      },
      {
        source: node,
        target: nodes[2],
      },
    ];

    const newGraph = {
      nodes: nodes.concat(this.state.graph.nodes),
      links: links.concat(this.state.graph.links),
    };

    this.setState({ graph: newGraph });
  }

  getStateFromProps(props) {
    return {
      graph: props.graph,
    };
  }

  render() {
    return <Network {...this.props} graph={this.state.graph} onNodeClick={this.onNodeClick} />;
  }
}

export default ExpandableNetwork;
