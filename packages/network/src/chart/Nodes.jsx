import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';

import { nodeShape } from '../utils/propShapes';

const propTypes = {
  nodes: PropTypes.arrayOf(nodeShape).isRequired,
  nodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  className: PropTypes.string,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  onMouseLeave: null,
  onMouseMove: null,
  onMouseEnter: null,
  onClick: null,
};

export default function Nodes({
  nodes,
  nodeComponent,
  className,
  onMouseLeave,
  onMouseMove,
  onMouseEnter,
  onClick,
}) {
  return (
    <Group>
      {nodes.map(node => (
        <Group
          key={`network-node-${node.id}`}
          className={cx('data-ui-nodes', className)}
          transform={`translate(${node.x}, ${node.y})`}
        >
          {React.createElement(nodeComponent, {
            node,
            onMouseLeave,
            onMouseMove,
            onMouseEnter,
            onClick,
          })}
        </Group>
      ))}
    </Group>
  );
}

Nodes.propTypes = propTypes;
Nodes.defaultProps = defaultProps;
