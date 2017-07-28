import { Children } from 'react';

import componentName from './componentName';
import { isSeries } from './componentIsX';

export default function collectDataFromChildSeries(children, propName = null) {
  let key = propName;
  let allData = [];
  const dataByIndex = {};

  Children.forEach(children, (Child, i) => {
    const name = componentName(Child);
    if (isSeries(name)) {
      // determine if we're collecting pre-binned or raw data
      if (!key) key = Child.props.rawData ? 'rawData' : 'binnedData';
      const data = Child.props[key];
      if (data) {
        dataByIndex[i] = data;
        allData = allData.concat(data);
      }
    }
  });

  return { allData, [`${key}ByIndex`]: dataByIndex };
}
