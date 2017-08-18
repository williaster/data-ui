import positionLabel from '../../src/utils/positionLabel';

describe('positionLabel', () => {
  test('it should be defined', () => {
    expect(positionLabel).toBeDefined();
  });

  test('for positions top, right, bottom, and left it should return an object with keys textAnchor, dx, and dy', () => {
    ['top', 'right', 'bottom', 'left'].forEach((position) => {
      expect(positionLabel(position)).toEqual(expect.objectContaining({
        textAnchor: expect.stringMatching(/start|middle|end/),
        dx: expect.any(Number),
        dy: expect.any(Number),
      }));
    });
  });

  test('it should used the passed labelOffset for dx and dy values', () => {
    expect(Math.abs(positionLabel('right', 5).dx)).toEqual(5);
    expect(Math.abs(positionLabel('right', 10).dx)).toEqual(10);
  });

  test('it should return null for non-sensical positions', () => {
    expect(positionLabel('nonsense')).toBeNull();
  });
});
