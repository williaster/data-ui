import raise from '../../src/utils/drag/util/raise';

describe('raise', () => {
  it('returns a copy of the original array', () => {
    const input = [0, 1, 2, 3, 4];
    const output = raise(input, 0);
    expect(input).not.toBe(output);
  });

  it('moves the item at raiseIndex to the end of the array', () => {
    const output = raise([0, 1, 2, 3, 4], 1);
    expect(output).toEqual([0, 2, 3, 4, 1]);
  });
});
