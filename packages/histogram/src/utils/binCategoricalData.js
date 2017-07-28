import caseInsensitiveSort from './caseInsensitiveSort';

const sortBins = (a, b) => caseInsensitiveSort(a.bin, b.bin);

/*
 * handles binning of categorical data by series index
 * if binValues are passed, ignores other bin values that are encountered
 *
 * returns an object of bins keyed on series index with the following shape
 *  {
 *    [seriesIdx]: Array<Object{ bin: String, data: Array<datum>, count: Number }>,
 *  }
 */
export default function binCategoricalData({ rawDataByIndex, valueAccessor, binValues = null }) {
  const binsByIndex = {};

  Object.keys(rawDataByIndex).forEach((index) => {
    const data = rawDataByIndex[index];
    const bins = {};

    data.forEach((datum) => {
      const bin = valueAccessor(datum);
      bins[bin] = bins[bin] || { bin, data: [], count: 0 };
      bins[bin].data.push(datum);
      bins[bin].count += 1;
    });

    // convert to an array of bins
    if (binValues) {
      binsByIndex[index] = binValues.map(bin => (bins[bin] || { bin, count: 0, data: [] }));
    } else {
      binsByIndex[index] = Object.values(bins).sort(sortBins);
    }
  });

  return binsByIndex;
}
