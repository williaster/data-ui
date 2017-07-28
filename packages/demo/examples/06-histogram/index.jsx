import React from 'react';
import { withScreenSize } from '@vx/responsive';

import {
  Histogram,
  BarSeries,
  // DensitySeries,
  // CircleSeries,
  XAxis,
  YAxis,
} from '@data-ui/histogram';

import readme from '../../node_modules/@data-ui/histogram/README.md';

import { normal, logNormal, mus, categorical } from './data';

console.log('normal', normal);
console.log('logNormal', logNormal);
console.log('categorical', categorical);

const ResponsiveHistogram = withScreenSize(({ screenWidth, children, ...rest }) => (
  <Histogram
    width={screenWidth / 1.3}
    height={screenWidth / 1.3 / 1.8}
    ariaLabel="Histogram showing ..."
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
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'lognormal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram binCount={25}>
          <BarSeries fillOpacity={0.2} rawData={logNormal[mus[1]][0]} />
          <BarSeries fill="#FC642D" fillOpacity={0.2} rawData={logNormal[mus[1]][1]} />
          <BarSeries fill="'#A61D55" fillOpacity={0.2} rawData={logNormal[mus[1]][2]} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'categorical',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram binType="categorical" >
          <BarSeries rawData={categorical} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'cumulative',
      components: [Histogram, BarSeries],
      // @TODO cumulative should be a property of the series, histogram has to account for it
      example: () => (
        <ResponsiveHistogram cumulative>
          <BarSeries rawData={normal[mus[1]][0]} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'normalized',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram normalized>
          <BarSeries rawData={normal[mus[1]][0]} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'horizontal normal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram horizontal>
          <BarSeries rawData={normal[mus[1]][0]} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'horizontal lognormal',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram horizontal>
          <BarSeries rawData={logNormal[mus[1]][2]} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'horizontal categories',
      components: [Histogram, BarSeries],
      example: () => (
        <ResponsiveHistogram binType="categorical" horizontal>
          <BarSeries rawData={categorical} />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
  ],
};
