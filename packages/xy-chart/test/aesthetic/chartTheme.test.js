import { theme as chartTheme } from '../../src';

// these are re-exported from @data-ui/theme so just test keys
describe('chartTheme', () => {
  it('should export colors', () => {
    expect(chartTheme.colors).toBeDefined();
  });

  it('should export labelStyles', () => {
    expect(chartTheme.labelStyles).toBeDefined();
  });

  it('should export gridStyles', () => {
    expect(chartTheme.gridStyles).toBeDefined();
  });

  it('should export xAxisStyles', () => {
    expect(chartTheme.xAxisStyles).toBeDefined();
  });

  it('should export xTickStyles', () => {
    expect(chartTheme.xTickStyles).toBeDefined();
  });

  it('should export yAxisStyles', () => {
    expect(chartTheme.yAxisStyles).toBeDefined();
  });

  it('should export yTickStyles', () => {
    expect(chartTheme.yTickStyles).toBeDefined();
  });
});
