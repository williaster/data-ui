import { bisector, bisect as d3Bisect } from 'd3-array';
import localPoint from '@vx/event/build/localPoint';

export default function findClosestDatum({ data, getX, xScale, event }) {
  if (!event || !event.target || !event.target.ownerSVGElement) return null;
  const bisect = bisector(getX).left;
  // if the g element has a transform we need to be in g coords not svg coords
  const gElement = event.target.ownerSVGElement.firstChild;
  const { x: mouseX } = localPoint(gElement, event);

  let dataX;
  if (typeof xScale.invert === 'function') {
    dataX = xScale.invert(mouseX);
  } else {
    // Ordinal scales don't have an invert function, so check if x is in the range bands
    const xValues = xScale.domain().map(val => xScale(val));
    const bandIndex = d3Bisect(xValues, mouseX);
    dataX = xScale.domain()[bandIndex];
    debugger;
    // if (xRange[bandIndex] + xScale.bandwidth() >= mouseX) {
    //
    // }
  }

  const index = bisect(data, dataX, 0);
  const d0 = data[index - 1];
  const d1 = data[index] || {};
  const d = !d0 || (Math.abs(dataX - getX(d0)) > Math.abs(dataX - getX(d1))) ? d1 : d0;
  return d;
}

// export function findClosestDatums({ children, getX, xScale, event }) {
//   const data = [];
//
//   // collect data from all series that have an x value near this point
//   React.Children.forEach(this.props.children, (Child) => {
//     if (isSeries(componentName(Child)) && !Child.props.disableMouseEvents) {
//       const d = findClosestDatum({ data: Child.props.data, getX, xScale, event });
//       if (d) data.push(d);
//     }
//   });
//   console.log(data)
// }
