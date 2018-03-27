/* eslint no-param-reassign: 0 */
import * as d3Force from 'd3-force';

export default function computeForceBasedCirclePack(rawData, xScale, size) {
  const data = rawData.map(d => ({ ...d, orgX: d.x }));
  const simulation = d3Force.forceSimulation(data)
   .force('x', d3Force.forceX(d => xScale(d.orgX)).strength(1))
   .force('y', d3Force.forceY(0))
   .force('collide', d3Force.forceCollide(d => size(d)))
   .stop();

  for (let i = 0; i < 500; i += 1) {
    simulation.tick();
    data.forEach((d) => {
      d.x = Math.min(d.x, xScale.range()[1]);
      d.x = Math.max(d.x, xScale.range()[0]);
    });
  }

  const result = data.map(d => ({
    ...d,
    offset: Math.abs(d.x - xScale(d.orgX)) / (xScale.range()[1] - xScale.range()[0]),
    x: xScale.invert(d.x),
  }));

  return result;
}
