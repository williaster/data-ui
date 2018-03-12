import React from 'react';
import { shallow } from 'enzyme';
import ViolinPlot from '@vx/stats/build/violinplot/ViolinPlot';
import { FocusBlurHandler } from '@data-ui/shared';

import { XYChart, ViolinPlotSeries, computeStats } from '../../src/';

describe('<ViolinPlotSeries />', () => {
  const mockData = [1, 2, 3, 4, 5, 5, 5, 5, 5, 6, 9, 5, 1];
  const mockStats = computeStats(mockData);
  const mockProps = {
    xScale: { type: 'band', paddingInner: 0.15, paddingOuter: 0.3 },
    yScale: { type: 'linear', includeZero: false },
    width: 100,
    height: 100,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    ariaLabel: 'label',
  };
  const violinProps = {
    data: [{ x: 'label1', binData: mockStats.binData }],
  };

  test('it should be defined', () => {
    expect(ViolinPlotSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<ViolinPlotSeries data={[]} />).type()).toBeNull();
  });

  test('it should render one violin per datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <ViolinPlotSeries {...violinProps} />
      </XYChart>,
    );
    expect(wrapper.find(ViolinPlotSeries).length).toBe(1);
    expect(wrapper.find(ViolinPlotSeries).first().dive().find(ViolinPlot).length).toBe(1);
  });

  test('it should call onMouseMove({ datum, data, event, index }), onMouseLeave(), and onClick({ datum, data, event, index }) on trigger when disableMouseEvents is falsy', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    let wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <ViolinPlotSeries {...violinProps} />
      </XYChart>,
    );

    let violin = wrapper.find(ViolinPlotSeries).dive()
      .find(ViolinPlot).dive()
      .find('path')
      .first();

    violin.simulate('mousemove', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(violinProps.data);
    expect(args.datum).toBe(violinProps.data[0]);
    expect(args.event).toBeDefined();
    expect(args.index).toBe(0);

    violin.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    violin.simulate('click', {});
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0];
    expect(args.data).toBe(violinProps.data);
    expect(args.datum).toBe(violinProps.data[0]);
    expect(args.event).toBeDefined();
    expect(args.index).toBe(0);

    // disable mouse events
    wrapper = shallow(
      <XYChart
        {...mockProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <ViolinPlotSeries {...violinProps} disableMouseEvents />
      </XYChart>,
    );

    violin = wrapper.find(ViolinPlotSeries).dive()
      .find(ViolinPlot).dive()
      .find('path')
      .first();

    violin.simulate('mousemove', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);

    violin.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    violin.simulate('click', {});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('it should render a FocusBlurHandler for each point', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <ViolinPlotSeries {...violinProps} />
      </XYChart>,
    );

    const violins = wrapper.find(ViolinPlotSeries).dive();
    expect(violins.find(FocusBlurHandler)).toHaveLength(violinProps.data.length);
  });

  test('it should invoke onMouseMove when focused', () => {
    const onMouseMove = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseMove={onMouseMove}>
        <ViolinPlotSeries {...violinProps} />
      </XYChart>,
    );

    const firstPoint = wrapper.find(ViolinPlotSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();

    firstPoint.simulate('focus');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });

  test('it should invoke onMouseLeave when blured', () => {
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseLeave={onMouseLeave}>
        <ViolinPlotSeries {...violinProps} />
      </XYChart>,
    );

    const firstPoint = wrapper.find(ViolinPlotSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();

    firstPoint.simulate('blur');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
