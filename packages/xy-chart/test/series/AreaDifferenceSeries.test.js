import React from 'react';
import { shallow } from 'enzyme';
import { scaleLinear } from '@vx/scale';
import { Threshold } from '@vx/threshold';

import { AreaDifferenceSeries, AreaSeries, LineSeries } from '../../src';

describe('<AreaDifferenceSeries />', () => {
  const mockScale = scaleLinear({ domain: [0, 100], range: [0, 100] });
  const mockMargin = { top: 5, right: 7, bottom: 27, left: 47 };
  const mockData = [
    { x: new Date('2017-01-05'), y: 15 },
    { x: new Date('2018-01-05'), y: 51 },
    { x: new Date('2019-01-05'), y: 377 },
  ];

  const mockData2 = [
    { x: new Date('2017-01-05'), y: 624 },
    { x: new Date('2018-01-05'), y: 45 },
    { x: new Date('2019-01-05'), y: 1 },
  ];

  it('should be defined', () => {
    expect(AreaDifferenceSeries).toBeDefined();
  });

  it('should render a <g /> with a Threshold and 2 AreaSeries', () => {
    const wrapper = shallow(
      <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
        <AreaSeries data={mockData} />
        <AreaSeries data={mockData} />
      </AreaDifferenceSeries>,
    );

    expect(wrapper.find('g')).toHaveLength(1);
    expect(wrapper.find(Threshold)).toHaveLength(1);
    expect(wrapper.find(AreaSeries)).toHaveLength(2);
  });

  it('should pass data from both AreaSeries to Threshold', () => {
    const wrapper = shallow(
      <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
        <AreaSeries data={mockData} />
        <AreaSeries data={mockData2} />
      </AreaDifferenceSeries>,
    );

    const threshold = wrapper.find(Threshold);
    const data = threshold.prop('data');

    expect.assertions(2 * mockData.length);
    data.forEach((d, i) => {
      expect(d.y0).toEqual(mockData[i].y);
      expect(d.y1).toEqual(mockData2[i].y);
    });
  });

  it('should pass appropriate fill and fillOpacity to Threshold', () => {
    const seriesProps = [{ fill: 'orange', fillOpacity: 0.4 }, { fill: 'pink', fillOpacity: 0.1 }];
    const wrapper = shallow(
      <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
        <AreaSeries data={mockData} {...seriesProps[0]} />
        <AreaSeries data={mockData} {...seriesProps[1]} />
      </AreaDifferenceSeries>,
    );

    const threshold = wrapper.find(Threshold);
    expect(threshold.prop('aboveAreaProps').fill).toBe(seriesProps[0].fill);
    expect(threshold.prop('aboveAreaProps').fillOpacity).toBe(seriesProps[0].fillOpacity);
    expect(threshold.prop('belowAreaProps').fill).toBe(seriesProps[1].fill);
    expect(threshold.prop('belowAreaProps').fillOpacity).toBe(seriesProps[1].fillOpacity);
  });

  it('should pass margin, xScale, yScale, onClick, onMouseMove, and onMouseLeave to child AreaSeries', () => {
    const propsToPass = {
      xScale: mockScale,
      yScale: mockScale,
      margin: mockMargin,
      onClick: () => {},
      onMouseMove: () => {},
      onMouseLeave: () => {},
    };
    const wrapper = shallow(
      <AreaDifferenceSeries {...propsToPass}>
        <AreaSeries data={mockData} />
        <AreaSeries data={mockData} />
      </AreaDifferenceSeries>,
    );

    const area1 = wrapper.find(AreaSeries).at(0);
    const area2 = wrapper.find(AreaSeries).at(1);

    expect.assertions(Object.keys(propsToPass).length * 2);
    Object.keys(propsToPass).forEach(propName => {
      expect(area1.prop(propName)).toBe(propsToPass[propName]);
      expect(area2.prop(propName)).toBe(propsToPass[propName]);
    });
  });

  it('should pass interpolation and disableMouseEvents to AreaSeries children', () => {
    const wrapper = shallow(
      <AreaDifferenceSeries
        xScale={mockScale}
        yScale={mockScale}
        interpolation="linear"
        disableMouseEvents
      >
        <AreaSeries disableMouseEvents={false} interpolation="cardinal" data={mockData} />
        <AreaSeries disableMouseEvents={false} interpolation="cardinal" data={mockData2} />
      </AreaDifferenceSeries>,
    );

    const area1 = wrapper.find(AreaSeries).at(0);
    const area2 = wrapper.find(AreaSeries).at(1);

    expect(area1.prop('disableMouseEvents')).toBe(true);
    expect(area2.prop('disableMouseEvents')).toBe(true);
    expect(area1.prop('interpolation')).toBe('linear');
    expect(area2.prop('interpolation')).toBe('linear');
  });

  it('should not render without x- and y-scales', () => {
    expect(
      shallow(
        <AreaDifferenceSeries>
          <AreaSeries data={mockData} />
          <AreaSeries data={mockData} />
        </AreaDifferenceSeries>,
      ).type(),
    ).toBeNull();
  });

  it('should not render without exactly 2 AreaSeries children', () => {
    expect(
      shallow(
        <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
          <AreaSeries data={mockData} />
        </AreaDifferenceSeries>,
      ).type(),
    ).toBeNull();

    expect(
      shallow(
        <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
          <AreaSeries data={mockData} />
          <LineSeries data={mockData} />
        </AreaDifferenceSeries>,
      ).type(),
    ).toBeNull();

    expect(
      shallow(
        <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
          <AreaSeries data={mockData} />
          <AreaSeries data={mockData} />
          <LineSeries data={mockData} />
        </AreaDifferenceSeries>,
      ).type(),
    ).toBeNull();
  });

  it('should not render if AreaSeries have data of different lengths', () => {
    expect(
      shallow(
        <AreaDifferenceSeries xScale={mockScale} yScale={mockScale}>
          <AreaSeries data={mockData} />
          <AreaSeries data={mockData.slice(1)} />
        </AreaDifferenceSeries>,
      ).type(),
    ).toBeNull();
  });
});
