import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape } from '../propShapes';

const propTypes = {
  // svg: PropTypes.node.isRequired,
  node: nodeShape.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  colorScale: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
  width: PropTypes.number,
};

const defaultProps = {
  width: 200,
};

function Tooltip({
  // svg,
  node,
  getColor,
  colorScale,
  x,
  y,
  width,
}) {
  console.log(node);
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: y,
        left: x,
        width,
        background: 'white',
        border: '1px solid #eaeaea',
        padding: 8,
        borderRadius: 4,
      }}
    >
      <span style={{ color: colorScale(getColor(node)) }}>
        {node.name}
      </span>
    </div>
  );
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
