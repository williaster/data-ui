import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape, linkShape } from '../propShapes';

import {
  formatInterval,
  timeUnitFromTimeExtent,
  oneDecimal,
} from '../utils/scale-utils';

import {
  ELAPSED_MS_ROOT,
  ELAPSED_MS,
  EVENT_COUNT,
} from '../constants';

import NodeSequence from './NodeSequence';

const propTypes = {
  svg: PropTypes.object.isRequired,
  link: linkShape,
  node: nodeShape,
  root: nodeShape,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  colorScale: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
  width: PropTypes.number,
};

const defaultProps = {
  width: 200,
  link: null,
  node: null,
  root: null,
};

function formatElapsedTime(ms) {
  return formatInterval(ms, timeUnitFromTimeExtent([0, ms]));
}

function ancestorsFromNode(node) {
  let curr = node;
  const ancestors = [];
  while (curr) {
    ancestors.push(curr);
    curr = curr.parent;
  }
  return ancestors.reverse();
}

function Tooltip({
  svg,
  node,
  link,
  root,
  getColor,
  colorScale,
  x,
  y,
  width,
}) {
  const sequence = ancestorsFromNode(link ? link.target : node);
  const hasNegativeDepth = sequence[0].depth < 0 || sequence[sequence.length - 1].depth < 0;
  const currNodeIndex = hasNegativeDepth ? 0 : sequence.length - 1;
  const separator = hasNegativeDepth ? ' < ' : ' > ';
  const subSequenceIndex = hasNegativeDepth ? [0, 2] : [-2];
  if (hasNegativeDepth) sequence.reverse();

  const Sequence = (
    <NodeSequence
      nodeArray={sequence}
      currNodeIndex={currNodeIndex}
      separator={separator}
      colorScale={colorScale}
      getColor={getColor}
    />
  );

  const SubSequence = sequence.length <= 2 ? null : (
    <NodeSequence
      nodeArray={sequence.slice(...subSequenceIndex)}
      currNodeIndex={hasNegativeDepth ? 0 : 1}
      separator={separator}
      colorScale={colorScale}
      getColor={getColor}
    />
  );

  const currNode = sequence[currNodeIndex];
  const nodeEvents = currNode[EVENT_COUNT];
  const percentOfPrev =
    `${oneDecimal((nodeEvents / (currNode.parent || currNode)[EVENT_COUNT]) * 100)}%`;
  const percentOfRoot = `${oneDecimal((nodeEvents / root[EVENT_COUNT]) * 100)}%`;

  const elapsedToNode = formatElapsedTime(currNode[ELAPSED_MS]);
  const elapsedToRoot = formatElapsedTime(currNode[ELAPSED_MS_ROOT]);

  const rect = svg.getBoundingClientRect();
  const parentWidth = rect.width;
  const parentHeight = rect.height;
  const left = x + width > parentWidth ? (x - width) + 16 : x + 50;
  const top = y + 170 > parentHeight ? (y - 110) : y + 60;

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 100,
        top,
        left,
        width,
        background: 'white',
        border: '1px solid #eaeaea',
        padding: 8,
        borderRadius: 4,
        fontFamily: 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif',
        fontSize: 12,
      }}
    >
      {SubSequence}
      {SubSequence &&
        <div>
          <div><strong>{nodeEvents}</strong> events</div>
          <div><strong>{elapsedToNode}</strong> mean elapsed time</div>
          <div><strong>{percentOfPrev}</strong> of previous</div>
          <br />
        </div>}

      {Sequence}
      <div>
        {!SubSequence && <div><strong>{nodeEvents}</strong> events</div>}
        {!SubSequence && currNode.depth !== 0 &&
          <div><strong>{percentOfPrev}</strong> of previous</div>}
        <div><strong>{percentOfRoot}</strong> of root</div>
        <div><strong>{elapsedToRoot}</strong> mean elapsed time to root</div>
      </div>
    </div>
  );
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
