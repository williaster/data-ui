/* eslint no-param-reassign: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { extent, max } from 'd3-array';

import { chartTheme } from '@data-ui/theme';
import { AreaClosed, LinePath } from '@vx/shape';
import { curveBasis } from '@vx/curve';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';

import AnimatedDensitySeries from './animated/AnimatedDensitySeries';
import { binnedDataShape } from '../utils/propShapes';
import kernelDensityEstimator from '../utils/kernelDensityEstimator';
import kernelParabolic from '../utils/kernels/epanechnikov';
import kernelGaussian from '../utils/kernels/gaussian';

const propTypes = {
  animated: PropTypes.bool,
  rawData: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  binnedData: binnedDataShape,
  binType: PropTypes.oneOf(['numeric', 'categorical']),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  horizontal: PropTypes.bool,
  kernel: PropTypes.oneOf(['gaussian', 'parabolic']),
  showArea: PropTypes.bool,
  showLine: PropTypes.bool,
  smoothing: PropTypes.number,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  useEntireScale: PropTypes.bool,
  valueAccessor: PropTypes.func,
  valueKey: PropTypes.string,

  // likely injected by parent Histogram
  binScale: PropTypes.func,
  valueScale: PropTypes.func,
};

const defaultProps = {
  animated: true,
  rawData: [],
  binnedData: [],
  binScale: null,
  binType: null,
  fill: chartTheme.colors.default,
  fillOpacity: 0.3,
  horizontal: false,
  kernel: 'gaussian',
  showArea: true,
  showLine: true,
  smoothing: 1,
  stroke: chartTheme.colors.default,
  strokeWidth: 2,
  strokeDasharray: null,
  strokeLinecap: 'round',
  useEntireScale: false,
  valueAccessor: d => d,
  valueKey: 'count',
  valueScale: null,
};

const getBin = d => (typeof d.bin !== 'undefined' ? d.bin : d.bin0);
const densityAccessor = d => d.value;
const cumulativeAccessor = d => d.cumulative;

function DensitySeries({
  animated,
  rawData,
  binnedData,
  binScale,
  binType,
  fill,
  fillOpacity,
  horizontal,
  kernel,
  showArea,
  showLine,
  smoothing,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap,
  useEntireScale,
  valueAccessor,
  valueKey,
  valueScale,
}) {
  if ((!showArea && !showLine)) return null;

  const binWidth = binScale.bandwidth
    ? binScale.bandwidth() // categorical
    : Math.abs(binScale(binnedData[0].bin1) - binScale(binnedData[0].bin0)); // numeric

  const binOffset = 0.5 * binWidth * (horizontal ? -1 : 1);

  // all density estimators require numeric data, so if we're passed categorical data
  // we just draw an area curve using the binned data
  let densityScale = valueScale;
  let getDensity = d => d[valueKey];
  let densityData = binnedData;

  if (binType === 'numeric') {
    // @TODO cache this with a non-functional component
    const cumulative = (/cumulative/gi).test(valueKey);
    const bins = binnedData.map(getBin);
    const kernelFunc = kernel === 'gaussian'
      ? kernelGaussian()
      : kernelParabolic(smoothing);

    const estimator = kernelDensityEstimator(kernelFunc, bins);

    densityData = estimator(rawData.map(valueAccessor));

    // area fills become inverted when the last value is less than the first value.
    // padding with 0s ensures this never happens
    densityData.unshift({ ...densityData[0], value: 0 });
    densityData.push({ ...densityData[densityData.length - 1], value: 0 });

    const densityRange = valueScale.range();
    if (!useEntireScale) {
      // set the range of the density scale to match the maximum data value
      const maxVal = max(binnedData, d => d[valueKey]);
      densityRange[1] = valueScale(maxVal);
    }

    densityScale = scaleLinear({
      domain: extent(densityData, (d, i) => {
        const val = densityAccessor(d);// compute cumulative in this loop
        d.cumulative = val + (i > 0 ? densityData[i - 1].cumulative : 0);
        d.id = i;
        return cumulative ? d.cumulative : val;
      }),
      range: densityRange,
    });

    getDensity = cumulative ? cumulativeAccessor : densityAccessor;
  }

  const offSetBinScale = binScale.copy();
  offSetBinScale.range(binScale.range().map(v => v + binOffset));

  const getX = horizontal ? getDensity : getBin;
  const getY = horizontal ? getBin : getDensity;
  const xScale = horizontal ? densityScale : offSetBinScale;
  const yScale = horizontal ? offSetBinScale : densityScale;

  return (
    <Group>
      {animated &&
        <AnimatedDensitySeries
          densityData={densityData}
          fill={fill}
          fillOpacity={fillOpacity}
          horizontal={horizontal}
          getX={getX}
          getY={getY}
          showArea={showArea}
          showLine={showLine}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          xScale={xScale}
          yScale={yScale}
        />}
      {!animated && showArea &&
        <AreaClosed
          data={densityData}
          x={getX}
          y={getY}
          xScale={xScale}
          yScale={yScale}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke="transparent"
          strokeWidth={strokeWidth}
          curve={curveBasis}
        />}
      {!animated && showLine && strokeWidth > 0 &&
        <LinePath
          data={densityData}
          x={getX}
          y={getY}
          xScale={xScale}
          yScale={yScale}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          curve={curveBasis}
          glyph={null}
        />}
    </Group>
  );
}

DensitySeries.propTypes = propTypes;
DensitySeries.defaultProps = defaultProps;

export default DensitySeries;
