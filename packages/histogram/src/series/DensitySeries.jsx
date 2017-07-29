import React from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';

import { AreaClosed, LinePath } from '@vx/shape';
import { curveBasis } from '@vx/curve';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';

import callOrValue from '../utils/callOrValue';
import kernelDensityEstimator from '../utils/kernelDensityEstimator';
import kernelParabolic from '../utils/kernels/epanechnikov';
import kernelGaussian from '../utils/kernels/gaussian';

const propTypes = {
  rawData: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  binnedData: PropTypes.array,
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
  valueKey: PropTypes.string,

  // likely injected by parent Histogram
  binScale: PropTypes.func,
  valueScale: PropTypes.func,
  // renderLabel: PropTypes.func,
};

const defaultProps = {
  rawData: [],
  binnedData: [],
  binScale: null,
  fill: '#008489',
  fillOpacity: 0.3,
  horizontal: false,
  kernel: 'gaussian',
  showArea: true,
  showLine: true,
  smoothing: 1,
  stroke: '#008489',
  strokeWidth: 2,
  strokeDasharray: null,
  strokeLinecap: 'round',
  valueKey: 'count',
  valueScale: null,
};

const getBin = d => d.bin;
const densityAccessor = d => d.value;

function DensitySeries({
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
  valueKey,
  valueScale,
}) {
  if ((!showArea && !showLine)) return null;

  const binOffset =
    (horizontal ? -1 : +1) * 0.5 * (binScale.bandwidth
      ? binScale.bandwidth() // categorical
      : Math.abs(binScale(binnedData[0].bin1) - binScale(binnedData[0].bin0))); // numeric

  let densityScale = valueScale;
  let getDensity = d => d[valueKey];
  let densityData = binnedData;

  if (binType === 'numeric') {
    const bins = binnedData.map(d => d.bin || d.bin0);
    const kernelFunc = kernel === 'gaussian' ? kernelGaussian() : kernelParabolic(smoothing);
    const kde = kernelDensityEstimator(kernelFunc, bins);

    densityData = kde(rawData); // @TODO valueAccessor

    densityScale = scaleLinear({
      domain: extent(densityData, d => d.value),
      range: valueScale.range(),
    });

    getDensity = densityAccessor;
  }

  const offSetBinScale = binScale.copy()
  offSetBinScale.range(binScale.range().map(v => v + binOffset));

  const getX = horizontal ? getDensity : getBin;
  const getY = horizontal ? getBin : getDensity;
  const xScale = horizontal ? densityScale : offSetBinScale;
  const yScale = horizontal ? offSetBinScale : densityScale;

  return (
    <Group>
      {showArea &&
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
      {showLine && strokeWidth > 0 &&
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
