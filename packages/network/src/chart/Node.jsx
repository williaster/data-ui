import React from 'react';
import PropTypes from 'prop-types';
import { nodeStyleShape, nodeShape } from '../utils/propShapes';

const proptypes = {
  nodeStyles: nodeStyleShape,
  node: nodeShape.isRequired,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
};

const defaultProps = {
  nodeStyles: {
    fill: '#15aabf',
    stroke: 'none',
    strokeWidth: 0,
    opacity: 0.5,
    defaultSize: 3,
  },
  onMouseMove: undefined,
  onClick: undefined,
  onMouseLeave: undefined,
  onMouseEnter: undefined,
};

export default function Node(props) {
  const { nodeStyles, node, onMouseMove, onClick, onMouseLeave, onMouseEnter } = props;
  const { stroke, strokeWidth, fill, opacity, defaultSize } = nodeStyles;
  return (
    <g opacity={node.opacity || opacity} >
      <circle
        r={node.size || defaultSize}
        fill={node.fill || fill}
        stroke={node.stroke || stroke}
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove && ((event) => {
          onMouseMove({
            event,
            index: node.index,
            id: node.id,
            data: node,
          });
        })}
        onMouseLeave={onMouseLeave && ((event) => {
          onMouseLeave({
            event,
            index: node.index,
            id: node.id,
            data: node,
          });
        })}
        onMouseEnter={onMouseEnter && ((event) => {
          onMouseEnter({
            event,
            index: node.index,
            id: node.id,
            data: node,
          });
        })}
        onClick={onClick && ((event) => {
          onClick({
            event,
            index: node.index,
            id: node.id,
            data: node,
          });
        })}
      />
      <text
        textAnchor="middle"
        y={2 * node.size}
      >
        {node.label}
      </text>
    </g>
  );
}

Node.propTypes = proptypes;
Node.defaultProps = defaultProps;
