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
  console.time('bin data');

  const {
    allRawData,
    rawDataByIndex,
    binnedDataByIndex,
  } = collectDataFromChildSeries(children);

  let result = binnedDataByIndex;

  if (Object.keys(binnedDataByIndex).length === 0) {
    const binningFunc = binType === 'numeric' ? binNumericData : binCategoricalData;

    result = binningFunc({
      allData: allRawData,
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

  console.timeEnd('bin data');

  return result;
}
