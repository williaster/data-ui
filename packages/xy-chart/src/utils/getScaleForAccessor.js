import { scaleLinear, scaleTime, scaleUtc, scaleBand, scaleOrdinal } from '@vx/scale';
import { extent } from 'd3-array';

export const scaleTypeToScale = {
  time: scaleTime,
  timeUtc: scaleUtc,
  linear: scaleLinear,
  band: scaleBand,
  ordinal: scaleOrdinal,
};

export default function getScaleForAccessor({
  allData,
  minAccessor,
  maxAccessor,
  type,
  includeZero = true,
  range,
  ...rest
}) {
  let domain;
  if (type === 'band' || type === 'ordinal') {
    domain = allData.map(minAccessor);
  }
  if (type === 'linear' || type === 'time' || type === 'timeUtc') {
    const [min, max] = extent([...extent(allData, minAccessor), ...extent(allData, maxAccessor)]);
    domain = [
      type === 'linear' && includeZero ? Math.min(0, min) : min,
      type === 'linear' && includeZero ? Math.max(0, max) : max,
    ];
  }

  return scaleTypeToScale[type]({ domain, range, ...rest });
}
