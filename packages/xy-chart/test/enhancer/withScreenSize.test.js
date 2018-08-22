import { withScreenSize } from '../../src';

describe('withScreenSize', () => {
  // this is re-exported from vx so is the only test we add
  it('should be defined', () => {
    expect(withScreenSize).toBeDefined();
  });
});
