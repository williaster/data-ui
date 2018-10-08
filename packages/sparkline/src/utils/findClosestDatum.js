import { bisector } from 'd3-array';
import localPoint from '@vx/event/build/localPoint';

export default function findClosestDatum({ data, getX, xScale, event, marginLeft = 0 }) {
  if (!event || !event.target || !event.target.ownerSVGElement) return {};
  const bisect = bisector(getX).right;

  const svgCoords = localPoint(event.target.ownerSVGElement, event);
  const x = svgCoords.x - marginLeft;
  const dataX = xScale.invert(x);
  const index = bisect(data, dataX, 1);
  const d0 = data[index - 1];
  const d1 = data[index];
  const d = !d0 || Math.abs(dataX - getX(d0)) > Math.abs(dataX - getX(d1)) ? d1 : d0;

  return {
    datum: d,
    index: d === d0 ? index - 1 : index,
  };
}
