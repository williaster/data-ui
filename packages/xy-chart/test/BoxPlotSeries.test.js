import React from 'react';
import { shallow } from 'enzyme';
import BoxPlot from '@vx/stats/build/boxplot/BoxPlot';

import { XYChart, BoxPlotSeries, computeStats } from '../src/';

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

  test('it should be defined', () => {
    expect(BoxPlotSeries).toBeDefined();
  });

  test('it should not render without x- and y-scales', () => {
    expect(shallow(<BoxPlotSeries data={[]} />).type()).toBeNull();
  });

  test('it should render one boxplot per datum', () => {
    const wrapper = shallow(
      <XYChart {...mockProps} >
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );
    expect(wrapper.find(BoxPlotSeries).length).toBe(1);
    expect(wrapper.find(BoxPlotSeries).first().dive().find(BoxPlot).length).toBe(1);
  });

  test('it should pass containerProps, outlierProps, boxProps, minProps, maxProps, and medianProps to BoxPlot', () => {
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
      <XYChart {...mockProps} >
        <BoxPlotSeries
          {...boxplotProps}
          {...extraBoxplotProps}
        />
      </XYChart>,
    );

    const boxplot = wrapper.find(BoxPlotSeries).first().dive().find(BoxPlot);

    const propsToCheck = Object.keys(extraBoxplotProps);
    const assertions = propsToCheck.length;

    expect.assertions(assertions);
    propsToCheck.forEach((prop) => {
      expect(boxplot.prop(prop)).toMatchObject(extraBoxplotProps[prop]);
    });
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
        <BoxPlotSeries {...boxplotProps} />
      </XYChart>,
    );

    let boxplot = wrapper.find(BoxPlotSeries).dive()
      .find(BoxPlot).dive()
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
    args = onClick.mock.calls[0][0];
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

    boxplot = wrapper.find(BoxPlotSeries).dive()
      .find(BoxPlot).dive()
      .find('rect')
      .last();

    boxplot.simulate('mousemove', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);

    boxplot.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    boxplot.simulate('click', {});
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
