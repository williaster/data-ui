import { Grid } from '@vx/grid';
import React from 'react';
import { shallow } from 'enzyme';

import { XYChart, XAxis, YAxis, LineSeries } from '../src';

describe('<XYChart />', () => {
  const mockProps = {
    xScale: { type: 'time' },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };

  const mockData = [
    { date: new Date('2017-01-05'), cat: 'a', num: 15 },
    { date: new Date('2018-01-05'), cat: 'b', num: 51 },
    { date: new Date('2019-01-05'), cat: 'c', num: 377 },
  ];

  test('it should be defined', () => {
    expect(XYChart).toBeDefined();
  });

  test('it should render an svg with an aria label', () => {
    const wrapper = shallow(<XYChart {...mockProps} />);
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    expect(svg.prop('aria-label')).toBe(mockProps.ariaLabel);
  });

  test('it should render a grid based on props', () => {
    let wrapper = shallow(<XYChart {...mockProps} />);
    let grid = wrapper.find(Grid);
    expect(grid.length).toBe(0);

    wrapper = shallow(<XYChart {...mockProps} showYGrid />);
    grid = wrapper.find(Grid);
    expect(grid.length).toBe(1);
    expect(grid.prop('numTicksColumns')).toBeFalsy();
    expect(grid.prop('numTicksRows')).toBeGreaterThan(0);

    wrapper = shallow(
      <XYChart {...mockProps} showXGrid showYGrid>
        <XAxis numTicks={13} />
        <YAxis numTicks={16} />
      </XYChart>,
    );
    grid = wrapper.find(Grid);
    expect(grid.length).toBe(1);
    expect(grid.prop('numTicksRows')).toBe(16);
    expect(grid.prop('numTicksColumns')).toBe(13);
  });

  test('it should pass scales to child series', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <LineSeries
          label="label"
          data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))}
        />
      </XYChart>,
    );
    const series = wrapper.find(LineSeries);
    expect(series.length).toBe(1);
    expect(series.prop('xScale')).toBeDefined();
    expect(series.prop('yScale')).toBeDefined();
  });

  test('it should compute time, linear, and band domains across all child series', () => {
    let wrapper = shallow(
      <XYChart {...mockProps}>
        <LineSeries
          label="label"
          data={mockData.slice(0, 2).map(d => ({ ...d, x: d.date, y: d.num }))}
        />
        <LineSeries
          label="labelii"
          data={mockData.slice(1, 3).map(d => ({ ...d, x: d.date, y: d.num }))}
        />
      </XYChart>,
    );
    let series = wrapper.find(LineSeries);
    let xScale = series.first().prop('xScale');
    let yScale = series.first().prop('yScale');
    expect(series.length).toBe(2);
    expect(xScale.domain()).toEqual([mockData[0].date, mockData[2].date]);
    expect(yScale.domain()).toEqual([mockData[0].num, mockData[2].num]);

    wrapper = shallow(
      <XYChart {...mockProps} xScale={{ type: 'band' }}>
        <LineSeries
          label="label"
          data={mockData.slice(0, 2).map(d => ({ ...d, x: d.cat, y: d.num }))}
        />
        <LineSeries
          label="labelii"
          data={mockData.slice(1, 3).map(d => ({ ...d, x: d.cat, y: d.num }))}
        />
      </XYChart>,
    );
    series = wrapper.find(LineSeries);
    xScale = series.first().prop('xScale');
    yScale = series.first().prop('yScale');
    expect(xScale.domain()).toEqual(mockData.map(d => d.cat));
    expect(yScale.domain()).toEqual([mockData[0].num, mockData[2].num]);
  });

  test('it should include zero in linear domains based on props', () => {
    let wrapper = shallow(
      <XYChart {...mockProps} yScale={{ type: 'linear', includeZero: true }}>
        <LineSeries label="l" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    let series = wrapper.find(LineSeries);
    let xScale = series.first().prop('xScale');
    let yScale = series.first().prop('yScale');
    expect(series.length).toBe(1);
    expect(xScale.domain()).toEqual([mockData[0].date, mockData[2].date]);
    expect(yScale.domain()).toEqual([0, mockData[2].num]);

    wrapper = shallow(
      <XYChart {...mockProps} yScale={{ type: 'linear', includeZero: true }}>
        <LineSeries label="l" data={mockData.map(d => ({ ...d, x: d.date, y: -d.num }))} />
      </XYChart>,
    );
    series = wrapper.find(LineSeries);
    xScale = series.first().prop('xScale');
    yScale = series.first().prop('yScale');
    expect(xScale.domain()).toEqual([mockData[0].date, mockData[2].date]);
    expect(yScale.domain()).toEqual([-mockData[2].num, 0]);
  });
});
