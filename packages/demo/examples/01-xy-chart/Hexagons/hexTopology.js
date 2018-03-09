export default function hexTopology({ radius, width, height }) {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  const m = Math.ceil((height + radius) / dy) + 1;
  const n = Math.ceil(width / dx) + 1;
  const geometries = [];
  const arcs = [];

  for (var j = -1; j <= m; ++j) {
    for (var i = -1; i <= n; ++i) {
      const y = j * 2;
      const x = (i + (j & 1) / 2) * 2;

      arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
    }
  }

  for (var j = 0, q = 3; j < m; ++j, q += 6) {
    for (var i = 0; i < n; ++i, q += 3) {
      geometries.push({
        type: 'Polygon',
        arcs: [
          [
            q,
            q + 1,
            q + 2,
            ~(q + (n + 2 - (j & 1)) * 3),
            ~(q - 2),
            ~(q - (n + 2 + (j & 1)) * 3 + 2),
          ],
        ],
        fill: Math.random() > i / n * 2,
      });
    }
  }

  return {
    transform: { translate: [0, 0], scale: [1, 1] },
    objects: {
      hexagons: { type: 'GeometryCollection', geometries },
    },
    arcs,
  };
}
