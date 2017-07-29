import React from 'react';
import { withScreenSize } from '@vx/responsive';

import {
  Histogram,
  BarSeries,
  DensitySeries,
  // CircleSeries,
  XAxis,
  YAxis,
  PatternLines,
  LinearGradient,
} from '@data-ui/histogram';

import readme from '../../node_modules/@data-ui/histogram/README.md';

import { normal, logNormal, mus, categorical } from './data';

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
          <LinearGradient
            id="normal_pattern"
            from="#008489"
            to="#008489"
            fromOpacity={0.6}
            rotate={45}
            vertical={false}
          />
          <DensitySeries
            showArea={false}
            smoothing={0.01}
            kernel="parabolic"
            rawData={normal[mus[2]][2]}
          />
          <BarSeries
            fill="url(#normal_pattern)"
            rawData={normal[mus[2]][2]}
          />
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
          <BarSeries
            fill="#FF5A5F"
            fillOpacity={0.2}
            strokeWidth={0}
            rawData={logNormal[mus[1]][1]}
          />
          <BarSeries
            fill="#A61D55"
            strokeWidth={0}
            fillOpacity={0.2}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke="#A61D55"
            showArea={false}
            smoothing={1}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke="#FF5A5F"
            showArea={false}
            smoothing={5}
            rawData={logNormal[mus[1]][1]}
          />
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
          <DensitySeries
            showLine={false}
            rawData={categorical}
          />
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
          <PatternLines
            id="area_pattern"
            height={6}
            width={6}
            stroke="#FF5A5F"
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <DensitySeries
            fill="url(#area_pattern)"
            showLine={false}
            smoothing={0.01}
            kernel="parabolic"
            rawData={normal[mus[1]][0]}
          />
          <BarSeries
            fill="transparent"
            stroke="#FF5A5F"
            rawData={normal[mus[1]][0]}
          />
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
