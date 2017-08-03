import React from 'react';
import { withScreenSize } from '@vx/responsive';
import { chartTheme } from '@data-ui/theme';

import {
  Histogram,
  BarSeries,
  DensitySeries,

  XAxis,
  YAxis,
  PatternLines,
  LinearGradient,
} from '@data-ui/histogram';

import readme from '../../node_modules/@data-ui/histogram/README.md';

import HistogramPlayground from './HistogramPlayground';
import { normal, logNormal, mus, categorical } from './data';

const ResponsiveHistogram = withScreenSize(({ screenWidth, children, ...rest }) => (
  <Histogram
    width={Math.min(1000, screenWidth / 1.3)}
    height={Math.min(1000 / 1.8, screenWidth / 1.3 / 1.8)}
    ariaLabel="Histogram showing ..."
    theme={chartTheme}
    {...rest}
  >
    {children}
  </Histogram>
));

export default {
  usage: readme,
  examples: [
    {
      description: 'Playground',
      components: [Histogram, BarSeries, DensitySeries, XAxis, YAxis],
      example: () => (
        <HistogramPlayground HistogramComponent={ResponsiveHistogram} />
      ),
    },
    {
      description: 'normal',
      components: [Histogram, BarSeries, DensitySeries],
      example: () => (
        <ResponsiveHistogram ariaLabel="test">
          <PatternLines
            id="normal"
            height={8}
            width={8}
            stroke="#fff"
            background={chartTheme.colors.categories[2]}
            strokeWidth={1}
            orientation={['horizontal', 'vertical']}
          />
          <BarSeries
            stroke={chartTheme.colors.categories[2]}
            fillOpacity={0.15}
            fill="url(#normal)"
            rawData={normal[mus[2]][2]}
          />
          <DensitySeries
            stroke={chartTheme.colors.categories[2]}
            showArea={false}
            smoothing={0.01}
            kernel="parabolic"
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
            fill={chartTheme.colors.categories[3]}
            fillOpacity={0.3}
            strokeWidth={0}
            rawData={logNormal[mus[1]][1]}
          />
          <BarSeries
            fill={chartTheme.colors.categories[5]}
            strokeWidth={0}
            fillOpacity={0.3}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke={chartTheme.colors.categories[5]}
            showArea={false}
            rawData={logNormal[mus[1]][2]}
          />
          <DensitySeries
            stroke={chartTheme.colors.categories[3]}
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
          <PatternLines
            id="categorical"
            height={8}
            width={8}
            background="#fff"
            stroke={chartTheme.colors.default}
            strokeWidth={0.5}
            orientation={['diagonal']}
          />
          <DensitySeries
            showLine={false}
            rawData={categorical}
            fillOpacity={0.2}
          />
          <BarSeries
            rawData={categorical}
            stroke={chartTheme.colors.default}
            fill="url(#categorical)"
            fillOpacity={0.7}
          />
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
          <BarSeries
            fill={chartTheme.colors.categories[2]}
            fillOpacity={0.1}
            rawData={normal[mus[1]][0]}
          />
          <DensitySeries
            stroke={chartTheme.colors.categories[2]}
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
          <LinearGradient
            id="normalized"
            from={chartTheme.colors.dark}
            to={chartTheme.colors.dark}
            fromOpacity={0.6}
            rotate={45}
            vertical={false}
          />
          <BarSeries
            fill="url(#normalized)"
            rawData={normal[mus[2]][2]}
          />
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
            stroke={chartTheme.colors.categories[2]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <DensitySeries
            fill="url(#horizontal_normal)"
            stroke={chartTheme.colors.categories[2]}
            storkeWidth={1}
            smoothing={0.005}
            kernel="parabolic"
            rawData={normal[mus[1]][0]}
          />
          <BarSeries
            fill="#FFF"
            fillOpacity={0.9}
            stroke={chartTheme.colors.categories[2]}
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
            background={chartTheme.colors.categories[2]}
            strokeWidth={1}
            orientation={['horizontal', 'vertical']}
          />
          <BarSeries
            fill="url(#horizontal_lognormal)"
            fillOpacity={0.2}
            stroke={chartTheme.colors.categories[2]}
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
        <ResponsiveHistogram binType="categorical" horizontal height={500}>
          <PatternLines
            id="horizontal_cat"
            height={8}
            width={8}
            stroke={chartTheme.colors.darkGray}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <BarSeries
            fill="url(#horizontal_cat)"
            stroke={chartTheme.colors.darkGray}
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
