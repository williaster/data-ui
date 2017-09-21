import * as d3Force from 'd3-force';

export default function layout({ graph, animated, callback }) {
  const newGraph = { ...graph };
  let callbackEvent = 'end';
  if (animated) {
    callbackEvent = 'tick';
  }
  d3Force
    .forceSimulation(newGraph.nodes)
    .force('charge', d3Force.forceManyBody().strength(-600))
    .force('link', d3Force.forceLink(newGraph.links).distance(100).strength(1))
    .force('x', d3Force.forceX())
    .force('y', d3Force.forceY())
    .force('center', d3Force.forceCenter(450, 250))
    .alphaMin(0.1)
    .on(callbackEvent, () => {
      const tempGraph = { ...graph };
      tempGraph.needUpdate = true;
      callback(tempGraph);
    });
}
