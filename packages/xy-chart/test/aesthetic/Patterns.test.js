import { PatternLines, PatternCircles, PatternWaves, PatternHexagons } from '../../src';

// these are re-exported from vx so we just check they are re-exported correctly
describe('<PatternLines />', () => {
  it('should be defined', () => {
    expect(PatternLines).toBeDefined();
  });
});

describe('<PatternCircles />', () => {
  it('should be defined', () => {
    expect(PatternCircles).toBeDefined();
  });
});

describe('<PatternWaves />', () => {
  it('should be defined', () => {
    expect(PatternWaves).toBeDefined();
  });
});

describe('<PatternHexagons />', () => {
  it('should be defined', () => {
    expect(PatternHexagons).toBeDefined();
  });
});
