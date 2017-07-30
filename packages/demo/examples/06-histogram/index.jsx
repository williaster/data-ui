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
      components: [Histogram, BarSeries, DensitySeries],
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
      components: [BarSeries, DensitySeries],
      example: () => (
        <ResponsiveHistogram binCount={25}>
          <BarSeries
            fill="#FF5A5F"
            fillOpacity={0.3}
            strokeWidth={0}
            rawData={logNormal[mus[1]][1]}
          />
          <BarSeries
            fill="#A61D55"
            strokeWidth={0}
            fillOpacity={0.3}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke="#A61D55"
            showArea={false}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke="#FF5A5F"
            showArea={false}
            rawData={logNormal[mus[1]][1]}
          />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
    {
      description: 'categorical',
      components: [BarSeries, DensitySeries],
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
      components: [BarSeries, DensitySeries],
      // @TODO cumulative should be a property of the series, histogram has to account for it
      example: () => (
        <ResponsiveHistogram cumulative>
          <BarSeries fillOpacity={0.2} rawData={normal[mus[1]][0]} />
          <DensitySeries
            fill="#008489"
            showArea={false}
            smoothing={0.01}
            kernel="parabolic"
            rawData={normal[mus[1]][0]}
          />
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
      components: [Histogram, BarSeries, DensitySeries],
      example: () => (
        <ResponsiveHistogram horizontal>
          <PatternLines
            id="horizontal_normal"
            height={8}
            width={8}
            stroke="#c2255c"
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <DensitySeries
            fill="url(#horizontal_normal)"
            stroke="#c2255c"
            storkeWidth={1}
            smoothing={0.005}
            kernel="parabolic"
            rawData={normal[mus[1]][0]}
          />
          <BarSeries
            fill="#FFF"
            fillOpacity={0.9}
            stroke="#c2255c"
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
          <PatternLines
            id="horizontal_lognormal"
            height={8}
            width={8}
            stroke="#fff"
            background="#c2255c"
            strokeWidth={1}
            orientation={['horizontal', 'vertical']}
          />
          <BarSeries
            fill="url(#horizontal_lognormal)"
            fillOpacity={0.2}
            stroke="#c2255c"
            rawData={logNormal[mus[1]][2]}
          />
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
          <PatternLines
            id="horizontal_cat"
            height={8}
            width={8}
            stroke="#484848"
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <BarSeries
            fill="url(#horizontal_cat)"
            stroke="#484848"
            fillOpacity={0.3}
            rawData={categorical}
          />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      ),
    },
  ],
};
