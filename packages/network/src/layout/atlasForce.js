import * as d3Force from 'd3-force';


class AtlasForceDirectedLayout {
  constructor({ animated }) {
    this.setAnimated(animated);
  }

  setGraph(graph) {
    this.graph = graph;
    this.clear();
    this.simulation = d3Force.forceSimulation(graph.nodes)
    .force('charge', d3Force.forceManyBody().strength(-600))
    .force('link', d3Force.forceLink(graph.links).distance(100).strength(1))
    .force('x', d3Force.forceX())
    .force('y', d3Force.forceY())
    .force('center', d3Force.forceCenter(450, 250))
    .alphaMin(0.1);
  }

  getGraph() {
    return this.graph;
  }

  layout({ callback }) {
    this.simulation.on(this.callbackEvent, () => {
      const tempGraph = { ...this.graph };
      callback(tempGraph);
    });
  }

  setAnimated(animated) {
    this.clear();
    this.animated = animated;
    this.callbackEvent = 'end';
    if (animated) {
      this.callbackEvent = 'tick';
    }
  }

  isAnimated() {
    return this.animated;
  }

  clear() {
    if (this.simulation) {
      this.simulation.on(this.callbackEvent, null);
    }
  }

}

export default AtlasForceDirectedLayout;
