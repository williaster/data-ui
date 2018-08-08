import { scaleBand, scaleLinear } from '@vx/scale';

import findClosestDatum from '../../src/utils/findClosestDatum';

describe('findClosestDatum', () => {
  beforeAll(() => {
    // mock prototype attributes for vx's localPoint
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 10,
      height: 10,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }));
  });

  const node = document.createElement('g');
  const event = {
    // missing clientX
    clientY: 0,
    target: {
      ownerSVGElement: {
        firstChild: node,
      },
    },
  };

  it('should be defined', () => {
    expect(findClosestDatum).toBeDefined();
  });

  it('should return the closest datum', () => {
    const data = [{ x: 0 }, { x: 5 }, { x: 10 }];
    const props = {
      data,
      getX: d => d.x,
      xScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
    };

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 1 },
      }),
    ).toBe(data[0]);

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 6 },
      }),
    ).toBe(data[1]);

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 9 },
      }),
    ).toBe(data[2]);
  });

  it('should work for ordinal scales', () => {
    const data = [{ x: 'a' }, { x: 'b' }, { x: 'c' }];
    const props = {
      data,
      getX: d => d.x,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
    };

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 0 },
      }),
    ).toBe(data[0]);

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 5 },
      }),
    ).toBe(data[1]);

    expect(
      findClosestDatum({
        ...props,
        event: { ...event, clientX: 10 },
      }),
    ).toBe(data[2]);
  });
});
