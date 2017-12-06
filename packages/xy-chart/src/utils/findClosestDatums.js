import { Children } from 'react';
import localPoint from '@vx/event/build/localPoint';

import findClosestDatum from './findClosestDatum';
import { componentName, isSeries } from '../utils/chartUtils';

export default function findClosestDatums({ children, xScale, yScale, getX, getY, event }) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const series = {};

  const gElement = event.target.ownerSVGElement.firstChild;
  const { y: mouseY } = localPoint(gElement, event);
  let closestDatum;
  let minDelta = Infinity;

  // collect data from all series that have an x value near this point
  Children.forEach(children, (Child) => {
    const { disableMouseEvents, data, seriesKey } = Child.props;
    if (seriesKey && isSeries(componentName(Child)) && !disableMouseEvents) {
      const datum = findClosestDatum({
        data,
        getX: xScale.invert ? getX : d => getX(d) + ((xScale.barWidth || 0) / 2),
        xScale,
        event,
      });
      if (datum) {
        series[seriesKey] = datum;
        const deltaY = Math.abs(yScale(getY(datum)) - mouseY);
        closestDatum = !closestDatum || deltaY < minDelta ? datum : closestDatum;
        minDelta = Math.min(deltaY, minDelta);
      }
    }
  });

  return { series, closestDatum };
}
