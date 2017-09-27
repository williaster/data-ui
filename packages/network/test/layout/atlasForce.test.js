import AtlasForceDirectedLayout from '../../src/layout/atlasForce';
import { defaultGraph } from '../data';

describe('AtlasForceDirectedLayout', () => {
  test('it should be defined', () => {
    expect(AtlasForceDirectedLayout).toBeDefined();
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
