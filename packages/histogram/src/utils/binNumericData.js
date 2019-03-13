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
  binCount: userBinCount = DEFAULT_BIN_COUNT,
  binValues,
  limits,
  rawDataByIndex,
  valueAccessor,
}) {
  const binCount = Array.isArray(binValues) ? binValues.length : userBinCount;
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
    .nice();

  histogram.domain(limits || scale.domain()).thresholds(binValues || scale.ticks(binCount));

  Object.keys(rawDataByIndex).forEach(index => {
    const data = rawDataByIndex[index];
    const seriesBins = histogram.value(valueAccessor)(data);

    // often the last bin is inclusive with the second to last bin, so we may combine them
    // see https://github.com/d3/d3-array/issues/54#issuecomment-293629278
    const lastBinIndex = seriesBins.length - 1;
    const lastBin = seriesBins[lastBinIndex];
    const nextToLastBin = seriesBins[lastBinIndex - 1];
    // last bin has same bounds, which equal the upper bound of the next to last bin
    const shouldCombineEndBins = nextToLastBin.x1 === lastBin.x0 && lastBin.x1 === lastBin.x0;
    const filteredBins = shouldCombineEndBins ? seriesBins.slice(0, -1) : seriesBins;

    binsByIndex[index] = filteredBins.map((bin, i) => ({
      bin0: bin.x0,
      // if the upper limit equals the lower one, use the delta between this bin and the last
      bin1:
        bin.x0 === bin.x1
          ? (i > 0 && bin.x0 + bin.x0 - seriesBins[i - 1].x0) || bin.x1 + 1
          : bin.x1,
      data: bin,
      // if the last bin was inclusive / omitted, add its count to the last bin
      count: bin.length + (shouldCombineEndBins && i === lastBin - 1 ? lastBin.length || 0 : 0),
      id: i.toString(),
    }));
  });

  return binsByIndex;
}
