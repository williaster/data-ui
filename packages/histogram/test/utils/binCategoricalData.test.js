import binCategoricalData from '../../src/utils/binCategoricalData';

describe('binCategoricalData', () => {
  const rawDataByIndex = {
    0: ['a', 'b', 'b', 'a', 'c', 'c', 'c'],
    1: ['a', 'a', 'a', 'a', 'c', 'c', 'b'],
  };

  test('it should be defined', () => {
    expect(binCategoricalData).toBeDefined();
  });

  test('it should return binned data arrays by index', () => {
    const binned = binCategoricalData({ rawDataByIndex, valueAccessor: d => d });
    expect(binned).toMatchObject({ 0: expect.any(Array), 1: expect.any(Array) });
  });

  test('bins should have bin, data, count, and id keys', () => {
    const expectedShape = {
      bin: expect.any(String),
      data: expect.any(Array),
      count: expect.any(Number),
      id: expect.any(String),
    };

    const binned = binCategoricalData({ rawDataByIndex, valueAccessor: d => d });
    expect(binned[0][0]).toMatchObject(expectedShape);
    expect(binned[1][0]).toMatchObject(expectedShape);
  });

  test('it should sort bins', () => {
    const binned = binCategoricalData({ rawDataByIndex, valueAccessor: d => d });
    expect(binned[0].map(d => d.bin)).toEqual(['a', 'b', 'c']);
  });

  test('it should use binValues if specified', () => {
    const binned = binCategoricalData({
      rawDataByIndex,
      valueAccessor: d => d,
      binValues: ['a', 'b'],
    });

    expect(binned[0].map(d => d.bin)).toEqual(['a', 'b']);
  });

  test('it should add accurate counts', () => {
    const binned = binCategoricalData({ rawDataByIndex, valueAccessor: d => d });
    expect(binned[0][0].count).toBe(2); // a
    expect(binned[0][1].count).toBe(2); // b
    expect(binned[0][2].count).toBe(3); // c
  });
});
