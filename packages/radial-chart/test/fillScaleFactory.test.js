import { singleHueScaleFactory, multiHueScaleFactory } from '../src';

describe('singleHueScaleFactory', () => {
  it('should be defined', () => {
    expect(singleHueScaleFactory).toBeDefined();
  });

  it('should return a scale', () => {
    const scale = singleHueScaleFactory();
    expect(scale).toBeDefined();
    expect(scale.domain()).toEqual(expect.any(Array));
    expect(scale.range()).toEqual(expect.any(Array));
  });

  it('should handle non-sensical brightness values', () => {
    const scale = singleHueScaleFactory(-100);
    expect(scale).toBeDefined();
    expect(scale.domain()).toEqual(expect.any(Array));
    expect(scale.range()).toEqual(expect.any(Array));
  });
});

describe('multiHueScaleFactory', () => {
  it('should be defined', () => {
    expect(multiHueScaleFactory).toBeDefined();
  });

  it('should return a scale', () => {
    const scale = multiHueScaleFactory();
    expect(scale).toBeDefined();
    expect(scale.domain()).toEqual(expect.any(Array));
    expect(scale.range()).toEqual(expect.any(Array));
  });

  it('should handle non-sensical hue values', () => {
    const scale = multiHueScaleFactory('zebras are a type of animal');
    expect(scale).toBeDefined();
    expect(scale.domain()).toEqual(expect.any(Array));
    expect(scale.range()).toEqual(expect.any(Array));
  });
});
