import { histogram as d3Histogram, extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

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
  const binsByIndex = {};
  const histogram = d3Histogram();
  const extent = d3Extent(allData, valueAccessor);
  const scale = scaleLinear().domain(extent).nice(binCount);

  histogram
    .domain(limits || scale.domain())
    .thresholds(binValues || scale.ticks(binCount));

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
