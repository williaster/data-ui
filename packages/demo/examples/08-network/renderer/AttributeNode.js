import React from 'react';
import PropTypes from 'prop-types';

const proptypes = {
  nodeStyles: PropTypes.object,
  node: PropTypes.object.isRequired,
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

export default function AttributeNode(props) {
  const { nodeStyles, node, onMouseMove, onClick, onMouseLeave, onMouseEnter } = props;
  const { stroke, strokeWidth, fill, opacity, defaultSize } = nodeStyles;
  return (
    <g opacity={node.opacity || opacity} >
      <rect
        // key={node.id}
        x={-node.size/2}
        y={-node.size/2}
        width={node.size || defaultSize}
        height={node.size || defaultSize}
        fill={node.fill || fill}
        stroke={node.stroke || stroke}
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove && ((event) => {
          onMouseMove({ event, data: node });
        })}
        onMouseLeave={onMouseLeave && ((event) => {
          onMouseLeave({ event, index: node.index });
        })}
        onMouseEnter={onMouseEnter && ((event) => {
          onMouseEnter({ event, index: node.index });
        })}
        onClick={onClick && ((event) => {
          onClick({ event, index: node.index });
        })}
      />
      <text
        textAnchor="middle"
        y={2 * node.size}
      >
        {`Attr Node ${node.label}`}
      </text>
    </g>
  );
}

AttributeNode.propTypes = proptypes;
AttributeNode.defaultProps = defaultProps;
