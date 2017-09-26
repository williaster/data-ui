import React from 'react';
import cx from 'classnames';
import { Group } from '@vx/group';

export default function Nodes({
  nodes,
  nodeComponent,
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
}) {

  return (
    <Group>
      {nodes.map((node, i) =>
        <Group
          key={`network-node-${i}`}
          className={cx('vx-network-nodes', className)}
          transform={`translate(${node.x}, ${node.y})`}
        >
          {React.createElement(nodeComponent, { node, onMouseLeave, onMouseMove, onMouseEnter, onClick })}
        </Group>,
      )}
    </Group>
  );
}
