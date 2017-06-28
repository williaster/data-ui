import { color, allColors, getPaletteForBrightness } from '../src';

describe('color', () => {
  test('`color` should be defined', () => {
    expect(color).toBeDefined();
  });

  test('`allColors` should be defined', () => {
    expect(allColors).toBeDefined();
  });

  test('`getPaletteForBrightness` should be defined', () => {
    expect(getPaletteForBrightness).toBeDefined();
  });
});
