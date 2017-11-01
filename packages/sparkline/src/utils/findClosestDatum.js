import { bisector } from 'd3-array';
import localPoint from '@vx/event/build/localPoint';

export default function findClosestDatum({ data, getX, xScale, event }) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const bisect = bisector(getX).right;
  // if the g element has a transform we need to be in g coords not svg coords
  const gElement = event.target.ownerSVGElement.firstChild;
  const { x } = localPoint(gElement, event);
  const dataX = xScale.invert(x);
  const index = bisect(data, dataX, 1);
  const d0 = data[index - 1];
  const d1 = data[index];
  const d = !d0 || (Math.abs(dataX - getX(d0)) > Math.abs(dataX - getX(d1))) ? d1 : d0;
  return {
    datum: d,
    index: d === d0 ? index - 1 : index,
  };
}
