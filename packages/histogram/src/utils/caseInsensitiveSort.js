export default (a, b) => (
  a.toLowerCase && b.toLowerCase
  ? a.toLowerCase() - b.toLowerCase()
  : a - b
);
