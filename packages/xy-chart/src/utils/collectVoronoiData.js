import { Children } from 'react';

import AreaDifferenceSeries from '../series/AreaDifferenceSeries';
import { isSeries, isDefined, componentName } from './chartUtils';

// this function collects all data from child series to defines a voronoi overlay
// because x,y coordinates are required to define a voronoi, it filters any points
// with undefined x or y values
export default function collectVoronoiData({ children, getX, getY }) {
  return Children.toArray(children).reduce((result, Child) => {
    const name = componentName(Child);
    if (isSeries(name) && !Child.props.disableMouseEvents) {
      if (name === AreaDifferenceSeries.displayName) {
        return result.concat(collectVoronoiData({ children: Child.props.children, getX, getY }));
      }

      return result.concat(Child.props.data.filter(d => isDefined(getX(d)) && isDefined(getY(d))));
    }

    return result;
  }, []);
}
