import { font } from '../src';

describe('font', () => {
  test('it should define fontFamily', () => {
    expect(font.fontFamily).toBeDefined();
  });

  test('it should define weights', () => {
    expect(font.light).toBeDefined();
    expect(font.bold).toBeDefined();
  });

  test('it should define sizes', () => {
    expect(font.tiny).toBeDefined();
    expect(font.small).toBeDefined();
    expect(font.regular).toBeDefined();
    expect(font.large).toBeDefined();
  });
});
