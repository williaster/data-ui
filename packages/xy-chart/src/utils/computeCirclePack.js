export default function computeCirclePack(data) {
  const sorted = data.sort((a, b) => a.x - b.x);
  return sorted.map(d => ({
    ...d,
    y: ((1 - d.importance) * (Math.random() > 0.5 ? 1 : -1)),
  }));
}
