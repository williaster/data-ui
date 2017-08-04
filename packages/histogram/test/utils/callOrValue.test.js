import callOrValue from '../../src/utils/callOrValue';

describe('callOrValue', () => {
  test('it should be defined', () => {
    expect(callOrValue).toBeDefined();
  });

  test('should return non-functions', () => {
    expect(callOrValue(123)).toEqual(123);
    expect(callOrValue('123')).toEqual('123');
    expect(callOrValue(['hello'])).toEqual(['hello']);
  });

  test('should call a function', () => {
    expect(callOrValue(() => 'abc')).toEqual('abc');
  });

  test('should pass args to functions', () => {
    expect(callOrValue((a, b, c) => `${a}${b}${c}`, 'x', 'y')).toEqual('xyundefined');
  });
});
