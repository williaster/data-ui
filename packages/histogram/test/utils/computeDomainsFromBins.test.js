import computeDomainsFromBins from '../../src/utils/computeDomainsFromBins';

describe('computeDomainsFromBins', () => {
  const numericProps = {
    binsByIndex: {
      0: [
        { bin0: 0, bin1: 1, count: 10, cumulative: 10 },
        { bin0: 1, bin1: 2, count: 5, cumulative: 15 },
        { bin0: 2, bin1: 3, count: 20, cumulative: 35 },
      ],
    },
    binType: 'numeric',
    valueKey: 'count',
  };

  const categoricalProps = {
    binsByIndex: {
      0: [
        { bin: 'a', count: 10, cumulative: 10 },
        { bin: 'b', count: 5, cumulative: 15 },
        { bin: 'c', count: 20, cumulative: 35 },
      ],
    },
    binType: 'categorical',
    valueKey: 'count',
  };

  it('should be defined', () => {
    expect(computeDomainsFromBins).toBeDefined();
  });

  it('should return an object with binDomain and valueDomain keys', () => {
    expect(computeDomainsFromBins(numericProps)).toEqual(
      expect.objectContaining({
        binDomain: expect.any(Array),
        valueDomain: expect.any(Array),
      }),
    );

    expect(computeDomainsFromBins(categoricalProps)).toEqual(
      expect.objectContaining({
        binDomain: expect.any(Array),
        valueDomain: expect.any(Array),
      }),
    );
  });

  it('should compute accurate domains for categorical data', () => {
    const result = computeDomainsFromBins(categoricalProps);
    expect(result.binDomain).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    expect(result.valueDomain).toEqual(expect.arrayContaining([0, 20]));
  });

  it('should compute compute accurate domains for numeric data', () => {
    const result = computeDomainsFromBins(numericProps);
    expect(result.binDomain).toEqual(expect.arrayContaining([0, 3]));
    expect(result.valueDomain).toEqual(expect.arrayContaining([0, 20]));
  });

  it('should compute a value domain based on valueKey', () => {
    const numeric = computeDomainsFromBins({ ...numericProps, valueKey: 'cumulative' });
    expect(numeric.valueDomain).toEqual(expect.arrayContaining([0, 35]));

    const categorical = computeDomainsFromBins({ ...categoricalProps, valueKey: 'cumulative' });
    expect(categorical.valueDomain).toEqual(expect.arrayContaining([0, 35]));
  });

  it('should maintain bin values ordering', () => {
    const binValues = ['b', 'a', 'c']
    const categorical = computeDomainsFromBins({ ...categoricalProps, binValues: binValues })
    expect(categorical.binDomain).toEqual(binValues)
  });
});
