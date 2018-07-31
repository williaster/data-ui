import { isAxis, isSeries } from '../../src/utils/componentIsX';

describe('isAxis', () => {
  it('should be defined', () => {
    expect(isAxis).toBeDefined();
  });

  it('should return true for axes', () => {
    expect(isAxis('XAxis')).toBe(true);
    expect(isAxis('YAxis')).toBe(true);
  });

  it('should return false for non-axes', () => {
    expect(isAxis('snow')).toBe(false);
    expect(isAxis('BarSeries')).toBe(false);
  });
});

describe('isSeries', () => {
  it('should be defined', () => {
    expect(isSeries).toBeDefined();
  });

  it('should return true for *Series', () => {
    expect(isSeries('BarSeries')).toBe(true);
    expect(isSeries('DensitySeries')).toBe(true);
  });

  it('should return false for non-*Series', () => {
    expect(isSeries('XAxis')).toBe(false);
    expect(isSeries('Bar')).toBe(false);
  });
});
