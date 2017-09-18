import React from 'react';
import { Group } from '@vx/group';
import Links from './Links';
import Nodes from './Nodes';

export default function Graph({
  graph,
  linkComponent,
  nodeComponent,
  onMouseLeave,
  onMouseMove,
  onNodeClick,
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
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onNodeClick}
      />
    </Group>
  );
}
