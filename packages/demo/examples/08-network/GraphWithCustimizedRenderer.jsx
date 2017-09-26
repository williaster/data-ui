/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
// import PropTypes from 'prop-types';
import React from 'react';
import {
  Network,
} from '@data-ui/network';


import UserNode from './renderer/UserNode';
import AttributeNode from './renderer/AttributeNode';
import DirectedLink from './renderer/DirectedLink';

class GraphWithCustimizedRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.renderLink = this.renderLink.bind(this);
  }

  onMouseLeave() {
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
        x: 100,
        y: 200,
        id: Math.floor(Math.random()*1000000000),
        size: 10,
        opacity: 1,
        fill: '#e03131',
        label: 'User A',
        type: 'User',
      },
      {
        x: 200,
        y: 200,
        id: Math.floor(Math.random()*1000000000),
        size: 10,
        opacity: 0.3,
        fill: '#5f3dc4',
        label: 'User B',
        type: 'User',
      },
      {
        x: 200,
        y: 100,
        id: Math.floor(Math.random()*1000000000),
        size: 15,
        opacity: 0.8,
        label: 'User C',
        type: 'Attr'
      },
    ];

    const links = [
      {
        source: node,
        target: nodes[0],
        id: Math.floor(Math.random()*1000000000),
      },
      {
        source: node,
        target: nodes[1],
        id: Math.floor(Math.random()*1000000000),
      },
      {
        source: node,
        target: nodes[2],
        id: Math.floor(Math.random()*1000000000),
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
    return (<Network
      {...this.props}
      graph={this.state.graph}
      onNodeClick={this.onNodeClick}
      onMouseEnter={this.onMouseEnter}
      onMouseLeave={this.onMouseLeave}
      renderNode={this.renderNode}
      renderLink={this.renderLink}
    />);
  }
}

export default GraphWithCustimizedRenderer;
