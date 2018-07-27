import React from 'react';
import scaleLinear from '@vx/scale/build/scales/linear';
import scaleBand from '@vx/scale/build/scales/band';
import findClosestDatums from '../../src/utils/findClosestDatums';

import { LineSeries } from '../../src';

describe('findClosestDatums', () => {
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

  it('it should be defined', () => {
    expect(findClosestDatums).toBeDefined();
  });

  it('it should return an object with closestDatum and series', () => {
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
        <LineSeries key="line1" seriesKey="line-1" data={data[0]} />,
        <LineSeries key="line2" seriesKey="line-2" data={data[1]} />,
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

  it('it should return one datum per series and use `seriesKey`s for series keys when possible', () => {
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
        <LineSeries key="line1" seriesKey="line-1" data={data[0]} />,
        <LineSeries key="line2" seriesKey="line-2" data={data[1]} />,
        <LineSeries key="line3" data={data[2]} />,
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

  it('it should ignore non-series children and series with disableMouseEvents set to true', () => {
    const args = {
      event,
      getX,
      getY,
      xScale: scaleBand({ domain: ['a', 'b', 'c'], range: [0, 10] }),
      yScale: scaleLinear({ domain: [0, 10], range: [0, 10] }),
      children: [
        <LineSeries key="line" disableMouseEvents seriesKey="line-1" data={[]} />,
        null,
        <div key="div" />,
      ],
    };

    const result = findClosestDatums(args);
    expect(result.closestDatum).toBeUndefined();
    expect(Object.keys(result.series)).toHaveLength(0);
  });
});
