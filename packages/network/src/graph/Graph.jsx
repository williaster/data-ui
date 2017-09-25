import PropTypes from 'prop-types';
import React from 'react';
import { Group } from '@vx/group';
import Links from './Links';
import Nodes from './Nodes';


const propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  linkComponent: PropTypes.func.isRequired,
  nodeComponent: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onNodeClick: PropTypes.func,
};

const defaultProps = {
  linkComponent: 'none',
  nodeComponent: null,
  onMouseLeave: null,
  onMouseMove: null,
  onNodeClick: null,
  onMouseEnter: null,
};

function Graph({
  graph,
  linkComponent,
  nodeComponent,
  onMouseLeave,
  onMouseMove,
  onNodeClick,
  onMouseEnter,
}) {
  return (
    <Group>
      <Links
        links={graph.links}
        linkComponent={linkComponent}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      />
      <Nodes
        nodes={graph.nodes}
        nodeComponent={nodeComponent}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onNodeClick}
      />
    </Group>
  );
}

Graph.propTypes = propTypes;
Graph.defaultProps = defaultProps;

export default Graph;
