import React from 'react';
import { shallow } from 'enzyme';
import { FocusBlurHandler } from '@data-ui/shared';

import { XYChart, PointSeries } from '../../src';
import GlyphDotComponent from '../../src/glyph/GlyphDotComponent';

describe('<PointSeries />', () => {
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

  it('it should be defined', () => {
    expect(PointSeries).toBeDefined();
  });

  it('it should not render without x- and y-scales', () => {
    expect(shallow(<PointSeries data={[]} />).type()).toBeNull();
  });

  it('it should render a GlyphDotComponent for each datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <PointSeries data={mockData.map(d => ({ ...d, x: d.date, y: d.num }))} />
      </XYChart>,
    );
    expect(wrapper.find(PointSeries)).toHaveLength(1);
    expect(
      wrapper
        .find(PointSeries)
        .dive()
        .find(GlyphDotComponent),
    ).toHaveLength(mockData.length);
  });

  it('it should not render points for null data', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <PointSeries
          data={mockData.map((d, i) => ({
            // test null x AND y's
            x: i === 0 ? null : d.date,
            y: i === 1 ? null : d.num,
          }))}
        />
      </XYChart>,
    );
    const series = wrapper.find(PointSeries).dive();
    expect(series.find(GlyphDotComponent)).toHaveLength(mockData.length - 2);
  });

  it('it should render labels if present', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <PointSeries
          data={mockData.map((d, i) => ({
            x: d.date,
            y: d.num,
            label: i === 0 ? 'LABEL' : null,
          }))}
          labelComponent={<text className="test" />}
        />
      </XYChart>,
    );
    const label = wrapper.render().find('.test');
    expect(label).toHaveLength(1);
    expect(label.text()).toBe('LABEL');
  });

  it('it should call onMouseMove({ datum, data, event, color }), onMouseLeave(), and onClick({ datum, data, event, color }) on trigger', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <PointSeries data={data} fill="army-green" />
      </XYChart>,
    );

    const point = wrapper
      .find(PointSeries)
      .dive()
      .find(GlyphDotComponent)
      .first()
      .dive();

    point.simulate('mousemove', { event: {} });
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('army-green');

    point.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    point.simulate('click', { event: {} });
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0]; // eslint-disable-line prefer-destructuring
    expect(args.data).toBe(data);
    expect(args.datum).toBe(data[0]);
    expect(args.event).toBeDefined();
    expect(args.color).toBe('army-green');
  });

  it('it should not trigger onMouseMove, onMouseLeave, or onClick if disableMouseEvents is true', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <PointSeries data={data} disableMouseEvents />
      </XYChart>,
    );

    const point = wrapper
      .find(PointSeries)
      .dive()
      .find(GlyphDotComponent)
      .first()
      .dive();

    point.simulate('mousemove');
    expect(onMouseMove).toHaveBeenCalledTimes(0);

    point.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(0);

    point.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('it should render a FocusBlurHandler for each point', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <PointSeries data={data} />
      </XYChart>,
    );

    const line = wrapper.find(PointSeries).dive();
    expect(line.find(FocusBlurHandler)).toHaveLength(data.length);
  });

  it('it should invoke onMouseMove when focused', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseMove = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseMove={onMouseMove}>
        <PointSeries data={data} />
      </XYChart>,
    );

    const firstPoint = wrapper
      .find(PointSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();
    firstPoint.simulate('focus');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });

  it('it should invoke onMouseLeave when blured', () => {
    const data = mockData.map(d => ({ ...d, x: d.date, y: d.num }));
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseLeave={onMouseLeave}>
        <PointSeries data={data} />
      </XYChart>,
    );

    const firstPoint = wrapper
      .find(PointSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();
    firstPoint.simulate('blur');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
