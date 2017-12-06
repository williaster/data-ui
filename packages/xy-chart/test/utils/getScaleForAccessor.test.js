import getScaleForAccessor, { scaleTypeToScale } from '../../src/utils/getScaleForAccessor';

describe('scaleTypeToScale', () => {
  test('it should be defined', () => {
    expect(scaleTypeToScale).toBeDefined();
  });

  test('it should have time, timeUtc, linear, band, and ordinal entries', () => {
    expect(scaleTypeToScale).toEqual(
      expect.objectContaining({
        time: expect.any(Function),
        timeUtc: expect.any(Function),
        linear: expect.any(Function),
        band: expect.any(Function),
        ordinal: expect.any(Function),
      }),
    );
  });
});

describe('getScaleForAccessor', () => {
  const allData = [
    { date: '2016-01-05', dirtyNum: undefined, num: 124, cat: 'a' },
    { date: '2017-01-05', dirtyNum: -15, num: 500, cat: 'b' },
    { date: '2018-01-05', dirtyNum: 7, num: 50, cat: 'c' },
    { date: '2019-01-05', dirtyNum: null, num: 501, cat: 'z' },
  ];

  test('should compute date domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => new Date(d.date),
      maxAccessor: d => new Date(d.date),
      type: 'time',
      range: [0, 100],
    }).domain()).toEqual([
      new Date(allData[0].date),
      new Date(allData[allData.length - 1].date),
    ]);
  });

  test('should compute date strings domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.date,
      maxAccessor: d => d.date,
      type: 'band',
      range: [0, 100],
    }).domain()).toEqual(['2016-01-05', '2017-01-05', '2018-01-05', '2019-01-05']);
  });

  test('should compute categorical domains', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.cat,
      maxAccessor: d => d.cat,
      type: 'band',
      range: [0, 100],
    }).domain()).toEqual(['a', 'b', 'c', 'z']);
  });

  test('should compute numeric domains including zero', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.num,
      maxAccessor: d => d.num,
      type: 'linear',
      range: [0, 100],
    }).domain()).toEqual([0, 501]);
  });

  test('should compute numeric domains excluding zero', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.num,
      maxAccessor: d => d.num,
      type: 'linear',
      range: [0, 100],
      includeZero: false,
    }).domain()).toEqual([50, 501]);
  });

  test('should compute numeric domains with missing values', () => {
    expect(getScaleForAccessor({
      allData,
      minAccessor: d => d.dirtyNum,
      maxAccessor: d => d.dirtyNum,
      type: 'linear',
      range: [0, 100],
      includeZero: false,
    }).domain()).toEqual([-15, 7]);
  });
});
