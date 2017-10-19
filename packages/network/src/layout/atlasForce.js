import * as d3Force from 'd3-force';

class AtlasForceDirectedLayout {
  constructor() {
    this.alphaMin = 0.1;
    this.forceManyBody = d3Force.forceManyBody();
    this.forceLink = d3Force.forceLink();
    this.forceCollide = d3Force.forceCollide();
    this.setAnimated(false);
  }

  setGraph(graph) {
    this.graph = graph;
    this.clear();
    this.forceLink.links(graph.links);
    this.simulation = d3Force
      .forceSimulation(graph.nodes)
      .force('charge', this.forceManyBody)
      .force('link', this.forceLink)
      .force('center', d3Force.forceCenter(450, 250))
      .force('collide', this.forceCollide)
      .alphaMin(this.alphaMin);
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

  setAlphaMin(alphaMin) {
    this.alphaMin = alphaMin;
    return this;
  }

  setAnimated(animated) {
    this.clear();
    this.animated = animated;
    this.callbackEvent = 'end';
    if (animated) {
      this.callbackEvent = 'tick';
    }
  }

  setCollideRadius(radius) {
    this.forceCollide.radius(radius);
    return this;
  }

  setCollideStrength(strength) {
    this.forceCollide.strength(strength);
    return this;
  }

  setNodeStrength(strength) {
    this.forceManyBody.strength(strength);
    return this;
  }

  setLinkStrength(strength) {
    this.forceLink.strength(strength);
    return this;
  }

  setNodeMinDistance(distance) {
    this.forceManyBody.distanceMin(distance);
    return this;
  }

  setNodeMaxDistance(distance) {
    this.forceManyBody.distanceMax(distance);
    return this;
  }

  setLinkDistance(distance) {
    this.forceLink.distance(distance);
    return this;
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
