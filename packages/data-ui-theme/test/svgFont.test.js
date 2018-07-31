import { svgFont } from '../src';

describe('svgFont', () => {
  it('should define fontFamily', () => {
    expect(svgFont.fontFamily).toBeDefined();
  });

  it('should define weights', () => {
    expect(svgFont.light).toBeDefined();
    expect(svgFont.bold).toBeDefined();
  });

  it('should define alignments', () => {
    expect(svgFont.start).toBeDefined();
    expect(svgFont.middle).toBeDefined();
    expect(svgFont.end).toBeDefined();
  });

  it('should define sizes', () => {
    expect(svgFont.tiny).toBeDefined();
    expect(svgFont.small).toBeDefined();
    expect(svgFont.regular).toBeDefined();
    expect(svgFont.large).toBeDefined();
  });
});
