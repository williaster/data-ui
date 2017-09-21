import React from 'react';
import PropTypes from 'prop-types';
import { nodeStyleShape } from '../utils/propShapes';

const proptypes = {
  nodeStyles: nodeStyleShape,
  node: PropTypes.object.isRequired,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
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
};

export default function Node(props) {
  const { nodeStyles, node, onMouseMove, onClick } = props;
  const { stroke, strokeWidth, fill, opacity, defaultSize } = nodeStyles;
  return (
    <circle
      // key={node.id}
      r={node.size || defaultSize}
      fill={node.fill || fill}
      stroke={node.stroke || stroke}
      strokeWidth={strokeWidth}
      opacity={node.opacity || opacity}
      {...props}
      onMouseMove={onMouseMove && ((event) => {
        onMouseMove({ event, data: node });
      })}
      onClick={onClick && ((event) => {
        onClick({ event, index: node.index });
      })}
    />
  );
}

Node.propTypes = proptypes;
Node.defaultProps = defaultProps;
