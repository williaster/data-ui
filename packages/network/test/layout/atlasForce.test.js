import { AtlasForceDirectedLayout } from '../../src';
import defaultGraph from '../data';

describe('AtlasForceDirectedLayout', () => {
  it('it should be defined', () => {
    expect(AtlasForceDirectedLayout).toBeDefined();
  });

  it('is should set the value of the graph properly', () => {
    const layout = new AtlasForceDirectedLayout();
    layout.setGraph(defaultGraph);
    expect(layout.getGraph()).toBe(defaultGraph);
  });

  it('is should set the value of the animated properly', () => {
    const layout = new AtlasForceDirectedLayout();
    layout.setGraph(defaultGraph);
    expect(layout.isAnimated()).toBe(false);
    layout.setAnimated(true);
    expect(layout.isAnimated()).toBe(true);
  });

  it('is should return a graph with the same data after laying out', () => {
    const layout = new AtlasForceDirectedLayout();
    layout.setGraph(defaultGraph);
    layout.layout({
      callback: newGraph => {
        expect(newGraph).toBeDefined();
        expect(newGraph.nodes).toHaveLength(defaultGraph.nodes.length);
        expect(newGraph.links).toHaveLength(defaultGraph.links.length);
      },
    });
  });
});
