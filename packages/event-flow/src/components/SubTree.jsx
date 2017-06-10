import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link';
import Node from './Node';

import { EVENT_COUNT } from '../constants';
import { nodeShape } from '../propShapes';

const propTypes = {
  nodes: PropTypes.objectOf(nodeShape).isRequired,
  nodeSorter: PropTypes.func, // could default to # events

  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  colorScale: PropTypes.func.isRequired,

  getX: PropTypes.func.isRequired,
  getY: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
};

const defaultProps = {
  nodeSorter(a, b) {
    return b[EVENT_COUNT] - a[EVENT_COUNT];
  },
};

class SubTree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}; // future for event distributions, etc
  }

  render() {
    const {
      nodeSorter,
      nodes,
      xScale,
      yScale,
      colorScale,
      getX,
      getY,
      getColor,
    } = this.props;

    const sortedNodes = Object.values(nodes).sort(nodeSorter);
    const yOffset = { left: 0, right: 0 };

    return (
      <Group>
        {sortedNodes.map((node) => {
          const offset = node.depth >= 0 ? 'right' : 'left';
          const hasParent = Boolean(node.parent);
          const hasChildren = node.children && Object.keys(node.children).length;

          const top = yOffset[offset];
          const left = xScale(getX(node));
          const parentLeft = hasParent && xScale(getX(node.parent));
          const height = yScale(getY(node));
          const nodeColor = colorScale(getColor(node));

          yOffset[offset] += height;

          return (
            <Group
              key={node.id}
              top={top}
              className="subtree"
            >
              {hasChildren &&
                <SubTree
                  {...this.props}
                  nodes={node.children}
                />}
              {/* link back to the parent */}
              {hasParent &&
                <Link
                  x={Math.min(left, parentLeft) + ((left > parentLeft ? 1 : 0) * (Node.width))}
                  y={0}
                  width={Math.abs(left - parentLeft)}
                  height={Math.max(1, height)}
                />
              }
              <Node
                node={node}
                x={left}
                y={0}
                height={Math.max(1, height)}
                fill={nodeColor}
              />
            </Group>
          );
        })}
      </Group>
    );
  }
}

SubTree.propTypes = propTypes;
SubTree.defaultProps = defaultProps;

export default SubTree;
