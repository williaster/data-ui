/* eslint react/prop-types: 0 */
import React from 'react';

import {
  Network,
  withScreenSize,
} from '@data-ui/network';

import {
  defaultGraph
} from './data';

import ExpandableNetwork from './ExpandableNetwork';
import GraphWithCustimizedRenderer from './GraphWithCustimizedRenderer';

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

const ResponsiveGraphWithCustimizedRenderer = withScreenSize(({ screenWidth, children, ...rest }) => (
  <GraphWithCustimizedRenderer
    width={Math.min(1000, screenWidth / 1.3)}
    height={Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8)}
    ariaLabel="Network showing ..."
    renderTooltip={renderTooltip}
    {...rest}
  >
    {children}
  </GraphWithCustimizedRenderer>
));


const nodes = defaultGraph.nodes;

const links = [
  {
    source: nodes[1],
    target: nodes[2],
    id: Math.floor(Math.random() * 1000000000),
  },
  {
    source: nodes[0],
    target: nodes[2],
    id: Math.floor(Math.random() * 1000000000),
  },
  {
    source: nodes[0],
    target: nodes[1],
    id: Math.floor(Math.random() * 1000000000),
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
    {
      description: 'ExpandableAnimatedNetwork',
      components: [ExpandableNetwork],
      example: () => (
        <ResponsiveExpandableNetowork
          ariaLabel="test"
          graph={graph}
          animated
        />
      ),
    },
    {
      description: 'GraphWithCustimizedRenderer',
      components: [GraphWithCustimizedRenderer],
      example: () => (
        <ResponsiveGraphWithCustimizedRenderer
          ariaLabel="test"
          graph={graph}
          animated
        />
      ),
    },
  ],
};
