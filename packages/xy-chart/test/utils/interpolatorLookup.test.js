import interpolatorLookup from '../../src/utils/interpolatorLookup';

describe('interpolatorLookup', () => {
  it('should be defined', () => {
    expect(interpolatorLookup).toBeDefined();
  });

  it('should have linear, cardinal, monotoneX, monotoneY, and natural interpolators', () => {
    expect(interpolatorLookup).toEqual(
      expect.objectContaining({
        linear: expect.any(Function),
        cardinal: expect.any(Function),
        monotoneX: expect.any(Function),
        monotoneY: expect.any(Function),
        natural: expect.any(Function),
      }),
    );
  });
});
