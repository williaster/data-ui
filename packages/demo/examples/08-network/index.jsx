/* eslint react/prop-types: 0 */
import React from 'react';

import {
  Network,
  withScreenSize,
} from '@data-ui/network';

import {
  defaultGraph as graph,
} from './data';

import ExpandableNetwork from './ExpandableNetwork';
import NetworkWithCustimizedRenderer from './NetworkWithCustimizedRenderer';

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

const ResponsiveNetwork = withScreenSize(({
  screenWidth,
  children,
  networkComponent,
  ...rest }) => (
    React.createElement(
      networkComponent,
      {
        width: Math.min(1000, screenWidth / 1.3),
        height: Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8),
        ariaLabel: 'Network showing ...',
        renderTooltip,
        ...rest,
      },
      children,
    )
));

export default {
  usage: 'Test',
  examples: [
    {
      description: 'DefaultNetwork',
      components: [Network],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={Network}
        />
      ),
    },
    {
      description: 'ExpandableNetwork',
      components: [ExpandableNetwork],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={ExpandableNetwork}
        />
      ),
    },
    {
      description: 'ExpandableAnimatedNetwork',
      components: [ExpandableNetwork],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={ExpandableNetwork}
          animated
        />
      ),
    },
    {
      description: 'NetworkWithCustimizedRenderer',
      components: [NetworkWithCustimizedRenderer],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={NetworkWithCustimizedRenderer}
          animated
        />
      ),
    },
  ],
};
