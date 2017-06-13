import React from 'react';
import PropTypes from 'prop-types';

import { nodeShape, linkShape } from '../propShapes';

import {
  ELAPSED_MS_ROOT,
  ELAPSED_MS,
  EVENT_COUNT,
} from '../constants';

const titleStyles = {};

const propTypes = {
  svg: PropTypes.node.isRequired,
  link: linkShape,
  node: nodeShape,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  colorScale: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
  width: PropTypes.number,
};

const defaultProps = {
  width: 200,
  nodeShape,
  linkShape,
};

function sequenceFromNode(node) {
  let curr = node;
  const nodes = [];
  while (curr) {
    nodes.push(curr);
    curr = curr.parent;
  }
  return nodes[0].depth < 0 ? nodes : nodes.reverse();
}

function Tooltip({
  svg,
  node,
  link,
  getColor,
  colorScale,
  x,
  y,
  width,
}) {
  // @todo underline root?
  // component for sequence
  const sequence = sequenceFromNode(link ? link.target : node);
  const lastSequence = sequence.slice(-2);
  const negativeDepth = lastSequence[0].depth < 0;
  const lastNodeIndex = negativeDepth ? 0 : sequence.length - 1;
  const separator = negativeDepth ? ' < ' : ' > ';
  const lastNode = sequence[lastNodeIndex];

  const nodeEvents = lastNode[EVENT_COUNT];
  const fractionPrev = nodeEvents / lastSequence[0][EVENT_COUNT];

  const elapsedToNode = lastNode[ELAPSED_MS];
  const elapsedToRoot = lastNode[ELAPSED_MS_ROOT];

  const parentWidth = svg.getBoundingClientRect().width;
  const left = x + width > parentWidth ? x - width : x;

  const Sequence = sequence.map((n, i) => (
    <span key={n.id}>
      {i !== 0 &&
        <span style={{ color: '#484848', fontSize: 14 }}>
          {separator}
        </span>}
      <span
        style={{
          color: colorScale(getColor(n)),
          fontSize: 15,
          fontWeight: i === lastNodeIndex ? 700 : 200,
          textDecoration: i === lastNodeIndex ? 'underline' : 'none',
        }}
      >
        {n.name.toUpperCase()}
      </span>
    </span>
  ));

  const subsequenceIndex = negativeDepth ? [0, 2] : [-2];
  const SubSequence = sequence.length <= 2 ? null :
    sequence.slice(...subsequenceIndex).map((n, i) => (
      <span key={n.id}>
        {i !== 0 &&
          <span style={{ color: '#484848', fontSize: 14 }}>
            {separator}
          </span>}
        <span
          style={{
            color: colorScale(getColor(n)),
            fontSize: 16,
            fontWeight: (i === 0 && negativeDepth) || (i !== 0 && !negativeDepth) ? 700 : 200,
            textDecoration:
              (i === 0 && negativeDepth) || (i !== 0 && !negativeDepth)
              ? 'underline' : 'none',
          }}
        >
          {n.name.toUpperCase()}
        </span>
      </span>
    ),
  );

  debugger;
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: y + 50,
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
      {Sequence}
      <div>{nodeEvents} events</div>
      <div>{elapsedToRoot} mean elapsed time</div>
      <div>--% of root</div>
      <br />
      {SubSequence}
      {SubSequence  && <div>{elapsedToNode} mean elapsed time</div>}
      {SubSequence && <div>{(fractionPrev * 100).toFixed(2)}% of previous</div>}
    </div>
  );
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
