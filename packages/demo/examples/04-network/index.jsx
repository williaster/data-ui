/* eslint react/prop-types: 0 */
import React from 'react';

import {
  Network,
  withScreenSize,
} from '@data-ui/network';

import {
  defaultGraph as graph,
} from './data';

import readme from '../../node_modules/@data-ui/network/README.md';

import ExpandableNetwork from './ExpandableNetwork';
import NetworkWithCustomizedRenderer from './NetworkWithCustomizedRenderer';
import ExpandableNetworkWithCustomizedLayout from './ExpandableNetworkWithCustomizedLayout';

function renderTooltip({ data }) {
  const { x, y, label } = data;
  return (
    <div>
      {label &&
        <div>
          <strong>{label}</strong>
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
  ...rest
}) => (
    React.createElement(
      networkComponent,
      {
        width: Math.min(1000, screenWidth / 1.3),
        height: Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8),
        ariaLabel: 'Network showing ...',
        renderTooltip,
        margin: { top: 40, right: 40, bottom: 40, left: 40 },
        ...rest,
      },
      children,
    )
));

export default {
  usage: readme,
  examples: [
    {
      description: 'Default network',
      components: [Network],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={Network}
        />
      ),
    },
    {
      description: 'Expandable network',
      components: [ExpandableNetwork],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={ExpandableNetwork}
        />
      ),
    },
    {
      description: 'Animated expandable network',
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
      description: 'Animated expandable network with custom layout',
      components: [ExpandableNetworkWithCustomizedLayout],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={ExpandableNetworkWithCustomizedLayout}
          animated
        />
      ),
    },
    {
      description: 'Animated expandable network with custom renderer',
      components: [NetworkWithCustomizedRenderer],
      example: () => (
        <ResponsiveNetwork
          graph={graph}
          networkComponent={NetworkWithCustomizedRenderer}
          animated
        />
      ),
    },
  ],
};
