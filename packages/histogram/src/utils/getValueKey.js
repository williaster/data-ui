export default ({ normalized, cumulative }) => {
  if (normalized && cumulative) return 'cumulativeDensity';
  if (cumulative) return 'cumulative';
  if (normalized) return 'density';
  return 'count';
};
