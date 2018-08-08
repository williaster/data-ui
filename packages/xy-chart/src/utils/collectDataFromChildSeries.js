import { Children } from 'react';
import { componentName, isSeries } from './chartUtils';
import AreaDifferenceSeries from '../series/AreaDifferenceSeries';

export default function collectDataFromChildSeries(children) {
  let allData = [];
  Children.forEach(children, Child => {
    if (Child && Child.props) {
      const { data } = Child.props;
      const name = componentName(Child);
      if (name === AreaDifferenceSeries.displayName) {
        allData = allData.concat(collectDataFromChildSeries(Child.props.children));
      } else if (data && isSeries(name)) {
        allData = allData.concat(Child.props.data);
      }
    }
  });

  return allData;
}
