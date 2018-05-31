import { Children } from 'react';
import { componentName, isSeries } from './chartUtils';

export default function collectDataFromChildSeries(children) {
  let allData = [];
  Children.forEach(children, (Child) => {
    if (Child && Child.props) {
      const { data } = Child.props;
      const name = componentName(Child);
      if (data && isSeries(name)) {
        allData = allData.concat(Child.props.data);
      } else if (name === 'ThresholdSeries') {
        allData = allData.concat(collectDataFromChildSeries(Child.props.children));
      }
    }
  });

  return allData;
}
