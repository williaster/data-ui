import { AtlasForceDirectedLayout } from '../../src/';
import defaultGraph from '../data';

describe('AtlasForceDirectedLayout', () => {
  test('it should be defined', () => {
    expect(AtlasForceDirectedLayout).toBeDefined();
  });

  test('is should set the value of the graph properly', () => {
    const layout = new AtlasForceDirectedLayout({ animated: false });
    layout.setGraph(defaultGraph);
    expect(defaultGraph === layout.getGraph());
  });

  test('is should set the value of the animated properly', () => {
    const layout = new AtlasForceDirectedLayout({ animated: false });
    layout.setGraph(defaultGraph);
    expect(layout.isAnimated() === false);
    layout.setAnimated(true);
    expect(layout.isAnimated());
  });

  test('is should return a graph with the same data after laying out', () => {
    const layout = new AtlasForceDirectedLayout({ animated: false });
    layout.setGraph(defaultGraph);
    layout.layout(
      {
        callback: (newGraph) => {
          expect(newGraph).toBeDefined();
          expect(newGraph.nodes.length === defaultGraph.nodes.length);
          expect(newGraph.links.length === defaultGraph.links.length);
        },
      });
  });
});
