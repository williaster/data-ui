import { GridColumns, GridRows } from '@vx/grid';
import { Group } from '@vx/group';
import React from 'react';
import { shallow, mount } from 'enzyme';

import { XYChart, xyChartPropTypes, XAxis, YAxis, LineSeries, WithTooltip } from '../../src';
import Voronoi from '../../src/chart/Voronoi';

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

  it('should be defined', () => {
    expect(XYChart).toBeDefined();
  });

  it('xyChartPropTypes should be defined', () => {
    expect(xyChartPropTypes).toEqual(expect.any(Object));
  });

  it('should not render with invalid width or height', () => {
    const valid = shallow(<XYChart {...mockProps} />);
    const invalidWidth = shallow(<XYChart {...mockProps} width={0} />);
    const invalidHeight = shallow(<XYChart {...mockProps} height={0} />);

    expect(valid.children()).toHaveLength(1);
    expect(invalidWidth.children()).toHaveLength(0);
    expect(invalidHeight.children()).toHaveLength(0);
  });

  it('should render an svg with an aria label', () => {
    const wrapper = shallow(<XYChart {...mockProps} />);
    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.prop('aria-label')).toBe(mockProps.ariaLabel);
  });

  it('should render a WithTooltip if renderTooltip is passed', () => {
    let wrapper = shallow(<XYChart {...mockProps} renderTooltip={null} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(0);

    wrapper = shallow(<XYChart {...mockProps} renderTooltip={() => {}} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(1);
  });

  it('should render an offset <Group /> based on margin', () => {
    const wrapper = shallow(<XYChart {...mockProps} />);
    const group = wrapper.find(Group);
    expect(group).toHaveLength(1);
    expect(group.prop('top')).toBe(mockProps.margin.top);
    expect(group.prop('left')).toBe(mockProps.margin.left);
  });

  it('should render GridColumns if showXGrid=true', () => {
    let wrapper = shallow(<XYChart {...mockProps} />);
    let columns = wrapper.find(GridColumns);
    expect(columns).toHaveLength(0);

    wrapper = shallow(<XYChart {...mockProps} showXGrid />);
    columns = wrapper.find(GridColumns);
    expect(columns).toHaveLength(1);
    expect(columns.prop('numTicks')).toBeGreaterThan(0);
  });

  it('should render GridRows if showYGrid=true', () => {
    let wrapper = shallow(<XYChart {...mockProps} />);
    let rows = wrapper.find(GridRows);
    expect(rows).toHaveLength(0);

    wrapper = shallow(<XYChart {...mockProps} showYGrid />);
    rows = wrapper.find(GridRows);
    expect(rows).toHaveLength(1);
    expect(rows.prop('numTicks')).toBeGreaterThan(0);
  });

  it('should pass numTicks from Axis components to Grid components if set', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} showXGrid showYGrid>
        <XAxis numTicks={13} />
        <YAxis numTicks={16} />
      </XYChart>,
    );
    const rows = wrapper.find(GridRows);
    const columns = wrapper.find(GridColumns);

    expect(rows).toHaveLength(1);
    expect(columns).toHaveLength(1);
    expect(rows.prop('numTicks')).toBe(16);
    expect(columns.prop('numTicks')).toBe(13);
  });

  it('should pass xGridValues and yGridValues to Grid components if passed', () => {
    const xGridValues = mockData.map(d => d.date);
    const yGridValues = mockData.map(d => d.num);

    const wrapper = shallow(
      <XYChart
        {...mockProps}
        showXGrid
        showYGrid
        xGridValues={xGridValues}
        yGridValues={yGridValues}
      />,
    );

    const rows = wrapper.find(GridRows);
    const columns = wrapper.find(GridColumns);

    expect(rows).toHaveLength(1);
    expect(columns).toHaveLength(1);
    expect(rows.prop('tickValues')).toEqual(yGridValues);
    expect(columns.prop('tickValues')).toEqual(xGridValues);
  });

  it('should pass tickValues from Axis components to Grid components if passed and x/yGridValues are not', () => {
    const xGridValues = mockData.map(d => d.date);
    const yGridValues = mockData.map(d => d.num);

    const wrapper = shallow(
      <XYChart {...mockProps} showXGrid showYGrid>
        <XAxis tickValues={xGridValues} />
        <YAxis tickValues={yGridValues} />
      </XYChart>,
    );

    const rows = wrapper.find(GridRows);
    const columns = wrapper.find(GridColumns);

    expect(rows).toHaveLength(1);
    expect(columns).toHaveLength(1);
    expect(rows.prop('tickValues')).toEqual(yGridValues);
    expect(columns.prop('tickValues')).toEqual(xGridValues);
  });

  it('should pass scales to child series', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <LineSeries label="label" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    const series = wrapper.find(LineSeries);
    expect(series).toHaveLength(1);
    expect(series.prop('xScale')).toEqual(expect.any(Function));
    expect(series.prop('yScale')).toEqual(expect.any(Function));
  });

  it('should pass scales and dimensions to child axes', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <LineSeries label="label" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
        <XAxis />
        <YAxis />
      </XYChart>,
    );
    const xaxis = wrapper.find(XAxis);
    const yaxis = wrapper.find(YAxis);

    expect(xaxis.prop('scale')).toEqual(expect.any(Function));
    expect(yaxis.prop('scale')).toEqual(expect.any(Function));
    expect(xaxis.prop('innerHeight')).toEqual(expect.any(Number));
    expect(yaxis.prop('innerWidth')).toEqual(expect.any(Number));
    expect(yaxis.prop('height')).toEqual(expect.any(Number));
  });

  it('should set labelOffset on child YAxis if it is not already set', () => {
    let wrapper = shallow(
      <XYChart {...mockProps}>
        <YAxis />
      </XYChart>,
    );

    expect(wrapper.find(YAxis).prop('labelOffset')).toEqual(expect.any(Number));

    wrapper = shallow(
      <XYChart {...mockProps}>
        <YAxis labelOffset={-101} />
      </XYChart>,
    );

    expect(wrapper.find(YAxis).prop('labelOffset')).toBe(-101);
  });

  it('should compute time, linear, and band domains across all child series', () => {
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
    expect(series).toHaveLength(2);
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

  it('should include zero in linear domains based on props', () => {
    let wrapper = shallow(
      <XYChart {...mockProps} yScale={{ type: 'linear', includeZero: true }}>
        <LineSeries label="l" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    let series = wrapper.find(LineSeries);
    let xScale = series.first().prop('xScale');
    let yScale = series.first().prop('yScale');
    expect(series).toHaveLength(1);
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

  it('should call the eventTriggerRefs callback on mount', () => {
    expect.assertions(4);

    function eventTriggerRefs(refs) {
      expect(refs).toEqual(expect.any(Object));
      expect(refs.click).toEqual(expect.any(Function));
      expect(refs.mousemove).toEqual(expect.any(Function));
      expect(refs.mouseleave).toEqual(expect.any(Function));
    }

    mount(<XYChart {...mockProps} eventTriggerRefs={eventTriggerRefs} />);
  });

  it('should set the passed innerRef callback on the svg', () => {
    expect.assertions(1);

    function innerRef(ref) {
      expect(ref.tagName).toBe('svg');
    }

    mount(<XYChart {...mockProps} innerRef={innerRef} />);
  });

  it('calls to eventTriggerRefs should invoke the corresponding event handlers passed to XYChart', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const callbackArgs = { test: 'object' };
    function eventTriggerRefs(refs) {
      refs.click(callbackArgs);
      refs.mousemove(callbackArgs);
      refs.mouseleave(callbackArgs);
    }

    mount(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        eventTriggerRefs={eventTriggerRefs}
      />,
    );

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    expect(onMouseMove.mock.calls[0][0]).toMatchObject(callbackArgs);

    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    expect(onMouseLeave.mock.calls[0][0]).toMatchObject(callbackArgs);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject(callbackArgs);
  });

  it('should render a Voronoi if eventTrigger="voronoi"', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} eventTrigger="voronoi">
        <LineSeries label="label" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );

    expect(wrapper.find(Voronoi)).toHaveLength(1);
  });

  it('should render a rect to intercept events if eventTrigger="container"', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} eventTrigger="container">
        <LineSeries label="label" data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );

    expect(wrapper.find('rect')).toHaveLength(1);
  });

  it('should pass appropriate coords in mouse event handlers if snapTooltipToDataX or snapTooltipToDataY is true', () => {
    const onMouseMove = jest.fn();
    const onClick = jest.fn();
    const data = mockData.map(d => ({ x: d.date, y: d.num }));
    const callbackArgs = { datum: data[1] };

    function eventTriggerRefs(refs) {
      refs.click(callbackArgs);
      refs.mousemove(callbackArgs);
    }

    mount(
      <XYChart
        {...mockProps}
        onClick={onClick}
        onMouseMove={onMouseMove}
        eventTriggerRefs={eventTriggerRefs}
        snapTooltipToDataX={false}
        snapTooltipToDataY={false}
      >
        <LineSeries data={data} />
      </XYChart>,
    );

    mount(
      <XYChart
        {...mockProps}
        onClick={onClick}
        onMouseMove={onMouseMove}
        eventTriggerRefs={eventTriggerRefs}
        snapTooltipToDataX
        snapTooltipToDataY={false}
      >
        <LineSeries data={data} />
      </XYChart>,
    );

    mount(
      <XYChart
        {...mockProps}
        onClick={onClick}
        onMouseMove={onMouseMove}
        eventTriggerRefs={eventTriggerRefs}
        snapTooltipToDataX={false}
        snapTooltipToDataY
      >
        <LineSeries data={data} />
      </XYChart>,
    );

    expect(onMouseMove).toHaveBeenCalledTimes(3);
    expect(onClick).toHaveBeenCalledTimes(3);

    // first call, no x/y
    expect(onMouseMove.mock.calls[0][0].coords.x).toBeUndefined();
    expect(onMouseMove.mock.calls[0][0].coords.y).toBeUndefined();
    expect(onClick.mock.calls[0][0].coords.x).toBeUndefined();
    expect(onClick.mock.calls[0][0].coords.y).toBeUndefined();

    // second call, just x
    expect(onMouseMove.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onMouseMove.mock.calls[1][0].coords.y).toBeUndefined();
    expect(onClick.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onClick.mock.calls[1][0].coords.y).toBeUndefined();

    // third call, just y
    expect(onMouseMove.mock.calls[2][0].coords.x).toBeUndefined();
    expect(onMouseMove.mock.calls[2][0].coords.y).toEqual(expect.any(Number));
    expect(onClick.mock.calls[2][0].coords.x).toBeUndefined();
    expect(onClick.mock.calls[2][0].coords.y).toEqual(expect.any(Number));
  });
});
