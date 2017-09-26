import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';

const propTypes = {
  nodes: PropTypes.array.isRequired,
  nodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

export default function Nodes({
  nodes,
  nodeComponent,
  className,
  ...rest
}) {
  return (
    <Group>
      {nodes.map(node =>
        <Group
          key={`network-node-${node.id}`}
          className={cx('data-ui-nodes', className)}
          transform={`translate(${node.x}, ${node.y})`}
        >
          {React.createElement(
            nodeComponent,
            {
              node,
              ...rest,
            })
          }
        </Group>,
      )}
    </Group>
  );
}

Nodes.propTypes = propTypes;
Nodes.defaultProps = defaultProps;

