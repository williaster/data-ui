import { Children } from 'react';
import localPoint from '@vx/event/build/localPoint';

import findClosestDatum from './findClosestDatum';
import { componentName, isSeries } from '../utils/chartUtils';

export default function findClosestDatums({
  children,
  xScale,
  yScale,
  getX,
  getY,
  event,
  maxXDistancePx = 1000,
}) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const series = {};

  const gElement = event.target.ownerSVGElement.firstChild;
  const { x: mouseX, y: mouseY } = localPoint(gElement, event);
  let closestDatum;
  let minDeltaX = Infinity;
  let minDeltaY = Infinity;

  // collect data from all series that have an x value near this point
  Children.forEach(children, (Child, childIndex) => {
    if (isSeries(componentName(Child)) && !Child.props.disableMouseEvents) {
      const { data, seriesKey } = Child.props;

      // @TODO data should be sorted, come up with a way to enforce+cache instead of relying on user
      const datum = findClosestDatum({
        data,
        getX,
        xScale,
        event,
      });

      const deltaX = Math.abs(xScale(getX(datum || {})) - mouseX);

      if (datum && deltaX <= maxXDistancePx) {
        const key = seriesKey || childIndex; // fall back to child index
        series[key] = datum;
        const deltaY = Math.abs(yScale(getY(datum)) - mouseY);
        closestDatum = deltaY < minDeltaY && deltaX <= minDeltaX ? datum : closestDatum;
        minDeltaX = closestDatum === datum ? deltaX : minDeltaX;
        minDeltaY = closestDatum === datum ? deltaY : minDeltaY;
      }
    }
  });

  return { series, closestDatum };
}
