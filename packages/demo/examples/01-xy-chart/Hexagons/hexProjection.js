export default function hexProjection(radius) {
  const dx = radius * 2 * Math.sin(Math.PI / 3);
  const dy = radius * 1.5;
  return {
    stream(stream) {
      return {
        point(x, y) {
          stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2);
        },
        lineStart() {
          stream.lineStart();
        },
        lineEnd() {
          stream.lineEnd();
        },
        polygonStart() {
          stream.polygonStart();
        },
        polygonEnd() {
          stream.polygonEnd();
        },
      };
    },
  };
}
//
// export default function genHexPathFactory(radius) {
//   const dx = radius * 2 * Math.sin(Math.PI / 3);
//   const dy = radius * 1.5;
//   return (x, y) => x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2;
// }
