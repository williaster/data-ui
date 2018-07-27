import { Children } from 'react';

import { isSeries, isDefined, componentName } from './chartUtils';

export default function collectVoronoiData({ children, getX, getY }) {
  return Children.toArray(children).reduce((result, Child) => {
    if (isSeries(componentName(Child)) && !Child.props.disableMouseEvents) {
      return result.concat(Child.props.data.filter(d => isDefined(getX(d)) && isDefined(getY(d))));
    }

    return result;
  }, []);
}
