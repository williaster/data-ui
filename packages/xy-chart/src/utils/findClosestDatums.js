import { Children } from 'react';
import { localPoint } from '@vx/event';

import findClosestDatum from './findClosestDatum';
import { componentName, isSeries } from './chartUtils';

const DEFAULT_MAX_DISTANCE_PX = 1000;

export default function findClosestDatums({
  children,
  xScale,
  yScale,
  margin = {},
  getX,
  getY,
  event,
  maxXDistancePx = DEFAULT_MAX_DISTANCE_PX,
}) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const series = {};

  const gElement = event.target.ownerSVGElement;
  const { x: svgMouseX, y: svgMouseY } = localPoint(gElement, event);
  const mouseX = svgMouseX - (margin.left || 0);
  const mouseY = svgMouseY - (margin.top || 0);

  let closestDatum;
  let minDeltaX = Infinity;
  let minDeltaY = Infinity;

  const flatSeriesChildren = [];
  Children.forEach(children, Child => {
    const name = componentName(Child);
    if (name === 'AreaDifferenceSeries') {
      Children.forEach(Child.props.children, NestedChild => {
        flatSeriesChildren.push(NestedChild);
      });
    } else if (isSeries(name)) {
      flatSeriesChildren.push(Child);
    }
  });

  // collect data from all series that have an x value near this point
  flatSeriesChildren.forEach((Child, childIndex) => {
    if (!Child.props.disableMouseEvents) {
      const { data, seriesKey } = Child.props;

      // @TODO data should be sorted, come up with a way to enforce+cache instead of relying on user
      const datum = findClosestDatum({
        data,
        getX,
        xScale,
        event,
        marginLeft: margin.left,
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
