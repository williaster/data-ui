/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
// import PropTypes from 'prop-types';
import React from 'react';
import {
  Network,
} from '@data-ui/network';


class ExpandableNetwork extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseLeave({ index }) {
    const nodes = this.state.graph.nodes;
    const links = this.state.graph.links;
    nodes.forEach(node => {
      node.opacity = null;
    });
    links.forEach(link => {
      link.opacity = null;
    });
    this.setState({ graph: { nodes, links } });
  }

  onMouseEnter({ index }) {
    const nodes = this.state.graph.nodes;
    const links = this.state.graph.links;
    nodes.forEach(node => {
      if (node !== nodes[index]) {
        node.opacity = 0.1;
      }
    });
    links.forEach(link => {
      if (link.source !== nodes[index] &&
        link.target !== nodes[index]) {
        link.opacity = 0.1;
      } else {
        link.target.opacity = null;
        link.source.opacity = null;
      }
    });
    this.setState({ graph: { nodes, links } });
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
    return (<Network
      {...this.props}
      graph={this.state.graph}
      onNodeClick={this.onNodeClick}
      onMouseEnter={this.onMouseEnter}
      onMouseLeave={this.onMouseLeave}
    />);
  }
}

export default ExpandableNetwork;
