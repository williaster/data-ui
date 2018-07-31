import positionLabel from '../../src/utils/positionLabel';

describe('positionLabel', () => {
  it('it should be defined', () => {
    expect(positionLabel).toBeDefined();
  });

  it('for positions top, right, bottom, and left it should return an object with keys textAnchor, dx, and dy', () => {
    ['top', 'right', 'bottom', 'left'].forEach(position => {
      expect(positionLabel(position)).toEqual(
        expect.objectContaining({
          textAnchor: expect.stringMatching(/start|middle|end/),
          dx: expect.any(Number),
          dy: expect.any(Number),
        }),
      );
    });
  });

  it('it should used the passed labelOffset for dx and dy values', () => {
    expect(Math.abs(positionLabel('right', 5).dx)).toEqual(5);
    expect(Math.abs(positionLabel('right', 10).dx)).toEqual(10);
  });

  it('if position is not one of top, right, bottom, and left, it should return the input value', () => {
    expect(positionLabel('nonsense')).toBe('nonsense');
  });
});
