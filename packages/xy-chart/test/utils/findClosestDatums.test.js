import React from 'react';
import scaleLinear from '@vx/scale/build/scales/linear';
import scaleBand from '@vx/scale/build/scales/band';
import findClosestDatums from '../../src/utils/findClosestDatums';

import { LineSeries } from '../../src';

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

  const event = {
    clientX: 0,
    clientY: 0,
    target: {
      ownerSVGElement: {
        firstChild: document.createElement('g'),
      },
    },
  };

  const getX = d => d.x;
  const getY = d => d.y;

  test('it should be defined', () => {
    expect(findClosestDatums).toBeDefined();
  });

  test('it should return an object with closestDatum and series', () => {
    const data = [
      [{ x: 'a', y: 5 }, { x: 'b', y: 0 }, { x: 'c', y: 8 }],
      [{ x: 'a', y: 2 }, { x: 'b', y: 5 }, { x: 'c', y: 9 }],
    ];

    const args = {
      event,
      getX,
      getY,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
      yScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
      children: [
        <LineSeries seriesKey="line-1" data={data[0]} />,
        <LineSeries seriesKey="line-2" data={data[1]} />,
      ],
    };

    const result = findClosestDatums(args);

    expect(result).toEqual(
      expect.objectContaining({
        closestDatum: expect.any(Object),
        series: expect.any(Object),
      }),
    );
  });

  test('it should return one datum per series and use `seriesKey`s for series keys when possible', () => {
    const data = [
      [{ x: 'a', y: 5 }, { x: 'b', y: 0 }, { x: 'c', y: 8 }],
      [{ x: 'a', y: 2 }, { x: 'b', y: 5 }, { x: 'c', y: 9 }],
      [{ x: 'a', y: 0 }, { x: 'b', y: 0 }, { x: 'c', y: 0 }],
    ];

    const args = {
      event,
      getX,
      getY,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
      yScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
      children: [
        <LineSeries seriesKey="line-1" data={data[0]} />,
        <LineSeries seriesKey="line-2" data={data[1]} />,
        <LineSeries data={data[2]} />,
      ],
    };

    const result = findClosestDatums(args);

    expect(result.series).toEqual(
      expect.objectContaining({
        'line-1': expect.any(Object),
        'line-2': expect.any(Object),
        2: expect.any(Object),
      }),
    );

    expect(data[0].indexOf(result.series['line-1'])).toBeGreaterThan(-1);
    expect(data[1].indexOf(result.series['line-2'])).toBeGreaterThan(-1);
    expect(data[2].indexOf(result.series[2])).toBeGreaterThan(-1);
  });

  test('it should ignore non-series children and series with disableMouseEvents set to true', () => {
    const args = {
      event,
      getX,
      getY,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
      yScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
      children: [
        <LineSeries disableMouseEvents seriesKey="line-1" data={[]} />,
        null,
        <div />,
      ],
    };

    const result = findClosestDatums(args);
    expect(result.closestDatum).toBeUndefined();
    expect(Object.keys(result.series).length).toBe(0);
  });
});
