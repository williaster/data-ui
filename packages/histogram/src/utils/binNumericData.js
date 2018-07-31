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
    .nice(binCount);

  histogram.domain(limits || scale.domain()).thresholds(binValues || scale.ticks(binCount));

  Object.keys(rawDataByIndex).forEach(index => {
    const data = rawDataByIndex[index];
    const seriesBins = histogram.value(valueAccessor)(data);

    // we remove the last bin because n bin thresholds give gives n+1 bins
    // if binValues is not specified, our last threshold is the upper bound
    // of the data so the final bin should always be zero
    const trimmedBins = binValues ? seriesBins : seriesBins.slice(0, -1);
    binsByIndex[index] = trimmedBins.map((bin, i) => ({
      bin0: bin.x0,
      bin1: bin.x1,
      data: bin,
      count: bin.length,
      id: i.toString(),
    }));

    // warn JIC
    if (trimmedBins.length < seriesBins.length && seriesBins[seriesBins.length - 1].count > 0) {
      console.warn('threw away non-zero bin');
    }
  });

  return binsByIndex;
}
