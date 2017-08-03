import caseInsensitiveSort from '../../src/utils/caseInsensitiveSort';

describe('caseInsensitiveSort', () => {
  test('it should be defined', () => {
    expect(caseInsensitiveSort).toBeDefined();
  });

  test('it should sort lowercase words', () => {
    const array = ['b', 'a', 'c'];
    expect(array.sort(caseInsensitiveSort)).toEqual(['a', 'b', 'c']);
  });

  test('it should sort uppercase words', () => {
    const array = ['Z', 'R', 'F'];
    expect(array.sort(caseInsensitiveSort)).toEqual(['F', 'R', 'Z']);
  });

  test('it should sort mixed-case words', () => {
    const array = ['B', 'a', 'C'];
    expect(array.sort(caseInsensitiveSort)).toEqual(['a', 'B', 'C']);
  });

  test('it should sort numbers', () => {
    const array = [1, 5, -10, 100];
    expect(array.sort(caseInsensitiveSort)).toEqual([-10, 1, 5, 100]);
  });
});
