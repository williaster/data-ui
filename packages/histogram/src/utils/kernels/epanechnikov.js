/*
 * Returns an Epanechnikov (parabolic) kernel function which takes a
 * free smoothing parameter as input.
 * code from https://gist.github.com/mbostock/4341954
 * kernel info https://en.wikipedia.org/wiki/Kernel_(statistics)
 */
export default function kernelEpanechnikov(smoothing = 5) {
  return val => (
    Math.abs(val / smoothing) <= 1
      ? 0.75 * ((1 - (val * val)) / smoothing)
      : 0
  );
}
