import addDensityAndCumulativeValuesToBins from '../../src/utils/addDensityAndCumulativeValuesToBins';

describe('addDensityAndCumulativeValuesToBins', () => {
  const bins = [
    { count: 1 },
    { count: 1 },
    { count: 1 },
    { count: 1 },
    { count: 1 },
  ];

  test('it should be defined', () => {
    expect(addDensityAndCumulativeValuesToBins).toBeDefined();
  });

  test('it should add cumulative counts to bins', () => {
    const binCopy = bins.map(b => ({ ...b }));
    addDensityAndCumulativeValuesToBins(binCopy);
    let cumulative = 0;
    binCopy.forEach((bin) => {
      cumulative += bin.count;
      expect(bin.cumulative).toBe(cumulative);
    });
  });

  test('it should add density values to bins', () => {
    const expected = 1 / 5;
    const binCopy = bins.map(b => ({ ...b }));
    addDensityAndCumulativeValuesToBins(binCopy);
    binCopy.forEach((bin) => {
      expect(bin.density - expected).toBeLessThan(0.000001);
    });
  });

  test('it should add cumulativeDensity values to bins', () => {
    const binCopy = bins.map(b => ({ ...b }));
    addDensityAndCumulativeValuesToBins(binCopy);
    let cumulativeDensity = 0;
    binCopy.forEach((bin) => {
      cumulativeDensity += bin.density;
      expect(bin.cumulativeDensity - cumulativeDensity).toBeLessThan(0.000001);
    });
  });
});
