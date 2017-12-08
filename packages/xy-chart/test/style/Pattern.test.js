import { PatternLines, PatternCircles, PatternWaves, PatternHexagons } from '../../src';

describe('Pattern', () => {
  test('PatternLines should be defined', () => {
    expect(PatternLines).toBeDefined();
  });

  test('PatternCircles should be defined', () => {
    expect(PatternCircles).toBeDefined();
  });

  test('PatternWaves should be defined', () => {
    expect(PatternWaves).toBeDefined();
  });

  test('PatternHexagons should be defined', () => {
    expect(PatternHexagons).toBeDefined();
  });
});
