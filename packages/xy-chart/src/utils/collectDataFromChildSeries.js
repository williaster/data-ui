import { Children } from 'react';

import { componentName, isSeries } from './chartUtils';

export default function collectDataFromChildSeries(children) {
  let allData = [];
  const dataByIndex = {};
  const dataBySeriesType = {};

  Children.forEach(children, (Child, i) => {
    if (Child && Child.props && Child.props.data) {
      const name = componentName(Child);
      const { data } = Child.props;
      if (data && isSeries(name)) {
        dataByIndex[i] = data;
        allData = allData.concat(data);
        dataBySeriesType[name] = (dataBySeriesType[name] || []).concat(data);
      }
    }
  });

  return { dataByIndex, allData, dataBySeriesType };
}
