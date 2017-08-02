import addDensityAndCumulativeValuesToBins from './addDensityAndCumulativeValuesToBins';
import binNumericData from './binNumericData';
import binCategoricalData from './binCategoricalData';
import collectDataFromChildSeries from './collectDataFromChildSeries';

export default function collectBinnedDataFromChildSeries({
  children,
  binCount,
  binType,
  binValues,
  limits,
  valueAccessor,
}) {
  console.time('binning data');

  let result;
  const { allData, rawDataByIndex, binnedDataByIndex } = collectDataFromChildSeries(children);
  result = binnedDataByIndex;

  if (!result) {
    const binningFunc = binType === 'numeric' ? binNumericData : binCategoricalData;

    result = binningFunc({
      allData,
      rawDataByIndex,
      valueAccessor,
      limits,
      binCount,
      binValues,
    });

  }

  Object.values(result).forEach((bins) => {
    addDensityAndCumulativeValuesToBins(bins);
  });

  console.timeEnd('binning data');

  return result;
}
