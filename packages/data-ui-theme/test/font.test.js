import { font } from '../src';

describe('font', () => {
  it('should define fontFamily', () => {
    expect(font.fontFamily).toBeDefined();
  });

  it('should define weights', () => {
    expect(font.light).toBeDefined();
    expect(font.bold).toBeDefined();
  });

  it('should define sizes', () => {
    expect(font.tiny).toBeDefined();
    expect(font.small).toBeDefined();
    expect(font.regular).toBeDefined();
    expect(font.large).toBeDefined();
  });
});
