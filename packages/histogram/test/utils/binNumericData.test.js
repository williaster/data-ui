import binNumericData from '../../src/utils/binNumericData';

describe('binNumericData', () => {
  const rawDataByIndex = {
    0: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
    1: [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 10, 10],
  };

  const args = {
    rawDataByIndex,
    allData: rawDataByIndex[0].concat(rawDataByIndex[1]),
    valueAccessor: d => d,
    limits: null,
    binCount: null,
    binValues: null,
  };

  it('should be defined', () => {
    expect(binNumericData).toBeDefined();
  });

  it('should return binned data arrays by index', () => {
    const binned = binNumericData(args);
    expect(binned).toMatchObject({ 0: expect.any(Array) });
  });

  it('bins should have bin0, bin1, data, count, and id keys', () => {
    const expectedShape = {
      bin0: expect.any(Number),
      bin1: expect.any(Number),
      data: expect.any(Array),
      count: expect.any(Number),
      id: expect.any(String),
    };

    const binned = binNumericData(args);
    expect(binned[0][0]).toMatchObject(expectedShape);
  });

  it('should use binValues if specified', () => {
    const binValues = [0, 1, 2, 3, 4, 5];
    const binned = binNumericData({ ...args, binValues });

    expect(binned[0]).toHaveLength(binValues.length);

    binned[0].forEach((bin, i) => {
      expect(bin.bin0).toBe(binValues[i]);
      if (binValues[i + 1]) expect(bin.bin1).toBe(binValues[i + 1]);
    });
  });

  it('should add accurate counts', () => {
    const binValues = [0, 1, 2, 3, 4, 5];
    const binned = binNumericData({ ...args, binValues });

    expect(binned[0][0].count).toBe(0);
    expect(binned[0][0].data).toEqual(expect.arrayContaining([]));

    expect(binned[0][1].count).toBe(1);
    expect(binned[0][1].data).toEqual(expect.arrayContaining([1]));

    expect(binned[0][2].count).toBe(2);
    expect(binned[0][2].data).toEqual(expect.arrayContaining([2, 2]));

    expect(binned[0][3].count).toBe(3);
    expect(binned[0][3].data).toEqual(expect.arrayContaining([3, 3, 3]));

    expect(binned[0][4].count).toBe(4);
    expect(binned[0][4].data).toEqual(expect.arrayContaining([4, 4, 4, 4]));

    expect(binned[0][5].count).toBe(0);
    expect(binned[0][5].data).toEqual(expect.arrayContaining([]));
  });

  it('should use the same buckets for multiple series', () => {
    const binned = binNumericData(args);
    binned[0].forEach((bin, i) => {
      expect(binned[1][i].bin0).toBe(bin.bin0);
      expect(binned[1][i].bin1).toBe(bin.bin1);
    });
  });
});
