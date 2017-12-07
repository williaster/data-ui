import scaleLinear from '@vx/scale/build/scales/linear';
import scaleBand from '@vx/scale/build/scales/band';
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

    Element.prototype.clientLeft = 0;
    Element.prototype.clientTop = 0;
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

  test('it should be defined', () => {
    expect(findClosestDatum).toBeDefined();
  });

  test('it should return the closest datum', () => {
    const props = {
      data: [{ x: 0 }, { x: 5 }, { x: 10 }],
      getX: d => d.x,
      xScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
    };

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 1 },
    })).toBe(props.data[0]);

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 6 },
    })).toBe(props.data[1]);

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 9 },
    })).toBe(props.data[2]);
  });

  test('it should work for ordinal scales', () => {
    const props = {
      data: [{ x: 'a' }, { x: 'b' }, { x: 'c' }],
      getX: d => d.x,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
    };

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 0 },
    })).toBe(props.data[0]);

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 5 },
    })).toBe(props.data[1]);

    expect(findClosestDatum({
      ...props,
      event: { ...event, clientX: 10 },
    })).toBe(props.data[2]);
  });
});
