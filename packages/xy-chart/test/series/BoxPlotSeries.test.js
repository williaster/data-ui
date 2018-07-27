import React from 'react';
import { shallow } from 'enzyme';
import BoxPlot from '@vx/stats/build/boxplot/BoxPlot';
import { FocusBlurHandler } from '@data-ui/shared';

import { XYChart, BoxPlotSeries, computeStats } from '../../src';

describe('<BoxPlotSeries />', () => {
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
  const boxplotProps = {
    data: [{ x: 'label1', ...mockStats.boxPlot }],
  };

  it('it should be defined', () => {
    expect(BoxPlotSeries).toBeDefined();
  });

  it('it should not render without x- and y-scales', () => {
    expect(shallow(<BoxPlotSeries data={[]} />).type()).toBeNull();
  });

  it('it should render one boxplot per datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );
    expect(wrapper.find(BoxPlotSeries)).toHaveLength(1);
    expect(
      wrapper
        .find(BoxPlotSeries)
        .first()
        .dive()
        .find(BoxPlot),
    ).toHaveLength(1);
  });

  it('it should pass containerProps, outlierProps, boxProps, minProps, maxProps, and medianProps to BoxPlot', () => {
    const extraBoxplotProps = {
      containerProps: {
        fill: 'pink',
      },
      outlierProps: {
        stroke: 'violet',
      },
      boxProps: {
        pointerEvents: 'none',
      },
      minProps: {
        strokeWidth: 0.5,
      },
      maxProps: {
        strokeWidth: 4.5,
      },
      medianProps: {
        strokeWidth: 5.5,
      },
    };
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <BoxPlotSeries {...boxplotProps} {...extraBoxplotProps} />
      </XYChart>,
    );

    const boxplot = wrapper
      .find(BoxPlotSeries)
      .first()
      .dive()
      .find(BoxPlot);

    const propsToCheck = Object.keys(extraBoxplotProps);
    const assertions = propsToCheck.length;

    expect.assertions(assertions);
    propsToCheck.forEach(prop => {
      expect(boxplot.prop(prop)).toMatchObject(extraBoxplotProps[prop]);
    });
  });

  it('it should call onMouseMove({ datum, data, event, index }), onMouseLeave(), and onClick({ datum, data, event, index }) on trigger when disableMouseEvents is falsy', () => {
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
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );

    let boxplot = wrapper
      .find(BoxPlotSeries)
      .dive()
      .find(BoxPlot)
      .dive()
      .find('rect')
      .last();

    boxplot.simulate('mousemove', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(boxplotProps.data);
    expect(args.datum).toBe(boxplotProps.data[0]);
    expect(args.event).toBeDefined();
    expect(args.index).toBe(0);

    boxplot.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    boxplot.simulate('click', {});
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0]; // eslint-disable-line prefer-destructuring
    expect(args.data).toBe(boxplotProps.data);
    expect(args.datum).toBe(boxplotProps.data[0]);
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
        <BoxPlotSeries {...boxplotProps} disableMouseEvents />
      </XYChart>,
    );

    boxplot = wrapper
      .find(BoxPlotSeries)
      .dive()
      .find(BoxPlot)
      .dive()
      .find('rect')
      .last();

    boxplot.simulate('mousemove', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);

    boxplot.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    boxplot.simulate('click', {});
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('it should render a FocusBlurHandler for each point', () => {
    const wrapper = shallow(
      <XYChart {...mockProps}>
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );

    const boxes = wrapper.find(BoxPlotSeries).dive();
    expect(boxes.find(FocusBlurHandler)).toHaveLength(boxplotProps.data.length);
  });

  it('it should invoke onMouseMove when focused', () => {
    const onMouseMove = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseMove={onMouseMove}>
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );

    const firstBox = wrapper
      .find(BoxPlotSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();
    firstBox.simulate('focus');
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });

  it('it should invoke onMouseLeave when blured', () => {
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <XYChart {...mockProps} onMouseLeave={onMouseLeave}>
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );

    const firstBox = wrapper
      .find(BoxPlotSeries)
      .dive()
      .find(FocusBlurHandler)
      .first();
    firstBox.simulate('blur');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
