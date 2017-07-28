/* eslint no-param-reassign: 0 */

// bins should have the shape
// Array<Object{ bin: String, data: Array<datum>, count: Number }>
export default function addDensityAndCumulativeValuesToBins(bins) {
  let cumulative = 0;
  bins.forEach((bin) => {
    cumulative += (isNaN(bin.count) ? 0 : bin.count);
    bin.cumulative = cumulative;
  });

  const total = cumulative;
  bins.forEach((bin) => {
    bin.density = bin.count / total;
    bin.cumulativeDensity = bin.cumulative / total;
  });
}
