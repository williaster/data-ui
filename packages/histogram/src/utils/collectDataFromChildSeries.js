import { Children } from 'react';

import componentName from './componentName';
import { isSeries } from './componentIsX';

export default function collectDataFromChildSeries(children) {
  let allRawData = [];
  let allBinnedData = [];

  const rawDataByIndex = {};
  const binnedDataByIndex = {};

  Children.forEach(children, (Child, i) => {
    const name = componentName(Child);
    if (isSeries(name)) {
      const rawData = Child.props.rawData;
      const binnedData = Child.props.binnedData;

      if (rawData && rawData.length > 0) {
        rawDataByIndex[i] = rawData;
        allRawData = allRawData.concat(rawData);
      }
      if (binnedData && binnedData.length > 0) {
        binnedDataByIndex[i] = binnedData;
        allBinnedData = allBinnedData.concat(binnedData);
      }
    }
  });

  return { allBinnedData, allRawData, binnedDataByIndex, rawDataByIndex };
}
