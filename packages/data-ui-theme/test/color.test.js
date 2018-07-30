import { color, allColors, getPaletteForBrightness } from '../src';

describe('color', () => {
  it('`color` should be defined', () => {
    expect(color).toBeDefined();
  });

  it('`allColors` should be defined', () => {
    expect(allColors).toBeDefined();
  });

  it('`getPaletteForBrightness` should be defined', () => {
    expect(getPaletteForBrightness).toBeDefined();
  });
});
