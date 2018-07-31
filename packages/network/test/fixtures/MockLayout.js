export default class MockLayout {
  constructor() {
    this.setAnimated(false);
  }

  setGraph(graph) {
    this.graph = graph;
    this.clear();
  }

  getGraph() {
    return this.graph;
  }

  layout({ callback }) {
    callback({
      nodes: this.graph.nodes,
      links: this.graph.links,
    });
  }

  setBoundingBox() {}

  isAnimated() {
    return this.animated;
  }

  setAnimated(animated) {
    this.clear();
    this.animated = animated;
  }

  clear() {}
}
