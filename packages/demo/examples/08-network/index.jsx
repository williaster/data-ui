/* eslint react/prop-types: 0 */
import React from 'react';

import {
  Network,
  withScreenSize,
} from '@data-ui/network';

import ExpandableNetwork from './ExpandableNetwork';

function renderTooltip({ data }) {
  const { x, y, id } = data;
  return (
    <div>
      {id &&
        <div>
          <strong>{id}</strong>
        </div>}
      <div>
        <strong> x </strong>
        {x && x.toFixed ? x.toFixed(2) : x}
      </div>
      <div>
        <strong>y </strong>
        {y && y.toFixed ? y.toFixed(2) : y}
      </div>
    </div>
  );
}

const ResponsiveNetowork = withScreenSize(({ screenWidth, children, ...rest }) => (
  <Network
    width={Math.min(1000, screenWidth / 1.3)}
    height={Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8)}
    ariaLabel="Network showing ..."
    renderTooltip={renderTooltip}
    {...rest}
  >
    {children}
  </Network>
));

const ResponsiveExpandableNetowork = withScreenSize(({ screenWidth, children, ...rest }) => (
  <ExpandableNetwork
    width={Math.min(1000, screenWidth / 1.3)}
    height={Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8)}
    ariaLabel="Network showing ..."
    renderTooltip={renderTooltip}
    {...rest}
  >
    {children}
  </ExpandableNetwork>
));


const nodes = [
  {
    x: 100,
    y: 200,
    id: 1231,
    size: 10,
    opacity: 1,
    fill: '#e03131',
  },
  {
    x: 200,
    y: 200,
    id: 1232,
    size: 10,
    opacity: 0.3,
    fill: '#5f3dc4',
  },
  {
    x: 200,
    y: 100,
    id: 1235,
    size: 15,
    opacity: 0.8,
  },
];

const links = [
  {
    source: nodes[1],
    target: nodes[2],
  },
  {
    source: nodes[0],
    target: nodes[2],
  },
  {
    source: nodes[0],
    target: nodes[1],
  },
];

const graph = { nodes, links };

export default {
  usage: 'Test',
  examples: [
    {
      description: 'DefaultNetwork',
      components: [Network],
      example: () => (
        <ResponsiveNetowork
          ariaLabel="test"
          graph={graph}
        />
      ),
    },
    {
      description: 'ExpandableNetwork',
      components: [ExpandableNetwork],
      example: () => (
        <ResponsiveExpandableNetowork
          ariaLabel="test"
          graph={graph}
        />
      ),
    },
  ],
};
