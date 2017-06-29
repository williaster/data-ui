const LIMIT = 8;

export default function complainAboutTooManySlicesIfNecessary(numSlices) {
  if (numSlices > LIMIT && process.env.NODE_ENV !== 'production') {
    console.warn(
      `Pie and donut visualizations with >${LIMIT} slices are often ineffective
      (encountered '${numSlices}'). Consider using a different visualization.`,
    );
  }
}
