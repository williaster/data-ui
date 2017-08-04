import { isAxis, isSeries } from '../../src/utils/componentIsX';

describe('isAxis', () => {
  test('it should be defined', () => {
    expect(isAxis).toBeDefined();
  });

  test('it should return true for axes', () => {
    expect(isAxis('XAxis')).toBe(true);
    expect(isAxis('YAxis')).toBe(true);
  });

  test('it should return false for non-axes', () => {
    expect(isAxis('snow')).toBe(false);
    expect(isAxis('BarSeries')).toBe(false);
  });
});

describe('isSeries', () => {
  test('it should be defined', () => {
    expect(isSeries).toBeDefined();
  });

  test('it should return true for *Series', () => {
    expect(isSeries('BarSeries')).toBe(true);
    expect(isSeries('DensitySeries')).toBe(true);
  });

  test('it should return false for non-*Series', () => {
    expect(isSeries('XAxis')).toBe(false);
    expect(isSeries('Bar')).toBe(false);
  });
});
