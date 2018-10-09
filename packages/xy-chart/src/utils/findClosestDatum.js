import { bisector, bisectLeft as d3BisectLeft } from 'd3-array';
import localPoint from '@vx/event/build/localPoint';

export default function findClosestDatum({ data, getX, xScale, event, marginLeft = 0 }) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const bisect = bisector(getX).left;

  // if the g element has a transform we need to be in g coords not svg coords
  const svgCoords = localPoint(event.target.ownerSVGElement, event);
  const mouseX = svgCoords.x - marginLeft;

  const isOrdinalScale = typeof xScale.invert !== 'function';
  let d;
  if (isOrdinalScale) {
    // Ordinal scales don't have an invert function so we do it maually
    const xDomain = xScale.domain();
    const scaledXValues = xDomain.map(val => xScale(val));
    const index = d3BisectLeft(scaledXValues, mouseX);
    const d0 = data[index - 1];
    const d1 = data[index];
    d = d0 || d1;
  } else {
    const dataX = xScale.invert(mouseX);
    const index = bisect(data, dataX, 0);
    const d0 = data[index - 1];
    const d1 = data[index] || {};
    d = !d0 || Math.abs(dataX - getX(d0)) > Math.abs(dataX - getX(d1)) ? d1 : d0;
  }

  return d;
}
