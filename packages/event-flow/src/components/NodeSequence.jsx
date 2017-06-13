import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape } from '../propShapes';

const propTypes = {
  nodeArray: PropTypes.arrayOf(nodeShape),
  currNodeIndex: PropTypes.number,
  separator: PropTypes.node,
  colorScale: PropTypes.func,
  getColor: PropTypes.func,
}
;
const defaultProps = {
  nodeArray: [],
  currNodeIndex: -1,
  separator: ' > ',
  colorScale: () => {},
  getColor: () => {},
};

const separatorStyles = { color: '#484848', fontSize: 14 };

function NodeSequence({
  nodeArray,
  currNodeIndex,
  separator,
  colorScale,
  getColor,
}) {
  return nodeArray.length ? (
    <div>
      {nodeArray.map((node, index) => (
        <span key={node.id}>
          {index !== 0 &&
            <span style={separatorStyles}>
              {separator}
            </span>}
          <span
            style={{
              fontSize: 15,
              color: colorScale(getColor(node)),
              fontWeight: index === currNodeIndex ? 700 : 200,
              textDecoration: index === currNodeIndex ? 'underline' : 'none',
              textDecorationColor: '#484848',
            }}
          >
            {node.name.toUpperCase()}
          </span>
        </span>
      ))}
    </div>
  ) : null;
}

NodeSequence.propTypes = propTypes;
NodeSequence.defaultProps = defaultProps;

export default NodeSequence;
