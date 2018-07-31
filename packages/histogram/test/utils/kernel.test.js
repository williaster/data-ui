import kernelDensityEstimator from '../../src/utils/kernelDensityEstimator';
import gaussian from '../../src/utils/kernels/gaussian';
import epanechnikov from '../../src/utils/kernels/epanechnikov';

describe('kernelDensityEstimator', () => {
  it('should be defined', () => {
    expect(kernelDensityEstimator).toBeDefined();
  });

  it('should return a function', () => {
    expect(kernelDensityEstimator()).toEqual(expect.any(Function));
  });

  it('the estimator should return an array of objects with bin and value keys', () => {
    const bins = [0, 1, 2];
    const values = [1, 2, 3, 4, 5];
    const kde = kernelDensityEstimator(gaussian(), bins);
    const result = kde(values);
    expect(result).toEqual(expect.any(Array));
    expect(result[0]).toEqual(
      expect.objectContaining({
        bin: expect.any(Number),
        value: expect.any(Number),
      }),
    );
  });
});

describe('gaussian', () => {
  it('should be defined', () => {
    expect(gaussian).toBeDefined();
  });

  it('should return a function that returns a number', () => {
    expect(gaussian()).toEqual(expect.any(Function));
    expect(gaussian()(1)).toEqual(expect.any(Number));
  });
});

describe('epanechnikov', () => {
  it('should be defined', () => {
    expect(epanechnikov).toBeDefined();
  });

  it('should return a function that returns a number', () => {
    expect(epanechnikov()).toEqual(expect.any(Function));
    expect(epanechnikov()(1)).toEqual(expect.any(Number));
  });
});
