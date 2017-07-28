import React from 'react';
import { withScreenSize } from '@vx/responsive';

import {
  Histogram,
  BarSeries,
  // DensitySeries,
  // CircleSeries,
  // XAxis,
  // YAxis,
} from '@data-ui/histogram';

import readme from '../../node_modules/@data-ui/histogram/README.md';

import { normal, logNormal, mus, categorical } from './data';

console.log('normal', normal);
console.log('logNormal', logNormal);
console.log('categorical', categorical);

const ResponsiveHistogram = withScreenSize(({ screenWidth, children, ...rest }) => (
  <Histogram
    width={screenWidth / 1.5}
    height={screenWidth / 1.5 / 1.8}
    ariaLabel="Histogram showing ..."
    binCount={15}
    {...rest}
  >
    {children}
  </Histogram>
));

export default {
  usage: readme,
  examples: [
    {
      description: 'normal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test">
          <BarSeries rawData={normal[mus[1]][0]} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'lognormal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test" >
          <BarSeries rawData={logNormal[mus[1]][0]} />
          <BarSeries fill="pink" rawData={logNormal[mus[1]][2]} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'categorical',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test" binType="categorical" >
          <BarSeries rawData={categorical} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'cumulative',
      components: [Histogram, BarSeries],
      // @TODO cumulative should be a property of the series, histogram has to account for it
      example: () => (
        <ResponsiveHistogram ariaLabel="test" cumulative>
          <BarSeries rawData={normal[mus[1]][0]} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'normalized',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test" normalized>
          <BarSeries rawData={normal[mus[1]][0]} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'horizontal normal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test" horizontal>
          <BarSeries rawData={normal[mus[1]][0]} />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'horizontal lognormal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test" horizontal>
          <BarSeries rawData={logNormal[mus[1]][2]} />
        </ResponsiveHistogram>
      ),
    },
  ],
};
