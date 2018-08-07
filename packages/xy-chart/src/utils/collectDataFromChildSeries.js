import { Children } from 'react';
import { componentName, isSeries } from './chartUtils';
import ThresholdSeries from '../series/ThresholdSeries';

export default function collectDataFromChildSeries(children) {
  let allData = [];
  Children.forEach(children, Child => {
    if (Child && Child.props) {
      const { data } = Child.props;
      const name = componentName(Child);
      if (name === ThresholdSeries.displayName) {
        allData = allData.concat(collectDataFromChildSeries(Child.props.children));
      } else if (data && isSeries(name)) {
        allData = allData.concat(Child.props.data);
      }
    }
  });

  return allData;
}
