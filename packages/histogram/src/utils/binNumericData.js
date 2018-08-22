import { histogram as d3Histogram, extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

const DEFAULT_BIN_COUNT = 10;

/*
 * handles binning of numeric data by series index
 * if binValues are passed, ignores other bin values that are encountered
 *
 * returns an object of bins keyed on series index with the following shape
 * {
 *   [seriesIdx]: Array<Object{
 *      bin0: String,
 *      bin1: String,
 *      data: Array<datum>,
 *      count: Number,
 *      id: String,
 *    }>,
 * }
 */
export default function binNumericData({
  allData,
  binCount = DEFAULT_BIN_COUNT,
  binValues,
  limits,
  rawDataByIndex,
  valueAccessor,
}) {
  let binThresholdCount = Math.max(...[2, binCount - 1]);
  if (Array.isArray(binValues)) binThresholdCount = binValues.length;
  const binsByIndex = {};
  const histogram = d3Histogram();
  let extent = d3Extent(allData, valueAccessor);

  if (binValues) {
    // account for extent of binValues if passed
    const binExtent = d3Extent(binValues);
    extent = [Math.min(binExtent[0], extent[0]), Math.max(binExtent[1], extent[1])];
  }
  const scale = scaleLinear()
    .domain(extent)
    .nice(binThresholdCount);

  histogram
    .domain(limits || scale.domain())
    .thresholds(binValues || scale.ticks(binThresholdCount));

  Object.keys(rawDataByIndex).forEach(index => {
    const data = rawDataByIndex[index];
    const seriesBins = histogram.value(valueAccessor)(data);

    binsByIndex[index] = seriesBins.map((bin, i) => ({
      bin0: bin.x0,
      // if the upper limit equals the lower one, use the delta between this bin and the last
      bin1: bin.x0 === bin.x1 ? (i > 0 && bin.x0 + bin.x0 - seriesBins[i - 1].x0) || 1 : bin.x1,
      data: bin,
      count: bin.length,
      id: i.toString(),
    }));
  });

  return binsByIndex;
}
