import { histogram as d3Histogram } from 'd3-array';

/*
 * handles binning of numeric data by series index
 * if binValues are passed, ignores other bin values that are encountered
 *
 * returns an object of bins keyed on series index with the following shape
 * {
 *   [seriesIdx]: Array<Object{ bin0: String, bin1: String, data: Array<datum>, count: Number }>,
 * }
 */
export default function binNumericData({
  allData,
  rawDataByIndex,
  valueAccessor,
  limits,
  binCount,
  binValues,
}) {
  const seriesCount = Object.keys(rawDataByIndex).length;
  let bins = binValues;

  // if there is more than one series and no pre-specified bins, we compute the histogram
  // for all data to find optimal buckets, then bin again individually
  if (seriesCount > 1 && !bins) {
    const allDataHistogram = d3Histogram();
    if (limits) allDataHistogram.domain(limits);
    if (binCount) allDataHistogram.thresholds(binCount);
    const allValues = allData.map(valueAccessor);
    bins = allDataHistogram(allValues).map(bin => bin.x0);
  }

  // now bin individual series data, using the same histogram
  const binsByIndex = {};
  const histogram = d3Histogram();
  if (limits) histogram.domain(limits);
  if (bins || binCount) histogram.thresholds(bins || binCount);

  Object.keys(rawDataByIndex).forEach((index) => {
    const data = rawDataByIndex[index];
    const values = data.map(valueAccessor);
    const seriesBins = histogram(values);

    // d3 bins are arrays of data with x0 and x1 properties added
    binsByIndex[index] = seriesBins.map(bin => ({
      bin0: bin.x0,
      bin1: bin.x1,
      data: bin,
      count: bin.length,
    }));
  });

  return binsByIndex;
}
