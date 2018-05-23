import React from 'react';
import { shallow, mount } from 'enzyme';
import { Bar } from '@vx/shape';
import { NodeGroup } from 'react-move';

import { BarSeries, Histogram } from '../../src/';
import AnimatedBarSeries from '../../src/series/animated/AnimatedBarSeries';

describe('<AnimatedBarSeries />', () => {
  const histogramProps = {
    ariaLabel: 'Histogram of ...',
    width: 200,
    height: 200,
  };

  const categoricalBinnedData = [
    { bin: 'a', count: 1, id: '0' },
    { bin: 'b', count: 4, id: '1' },
    { bin: 'c', count: 6, id: '2' },
    { bin: 'd', count: 2, id: '3' },
    { bin: 'e', count: 10, id: '4' },
  ];

  const numericBinnedData = [
    { bin0: 0, bin1: 1, count: 1, id: '0' },
    { bin0: 1, bin1: 2, count: 4, id: '1' },
    { bin0: 2, bin1: 3, count: 6, id: '2' },
    { bin0: 3, bin1: 4, count: 2, id: '3' },
    { bin0: 4, bin1: 5, count: 10, id: '4' },
  ];

  test('it should be defined', () => {
    expect(AnimatedBarSeries).toBeDefined();
  });

  test('it should render a resonance <NodeGroup />', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps}>
        <BarSeries animated binnedData={numericBinnedData} />
      </Histogram>,
    );
    const barWrapper = wrapper.find(BarSeries).dive();
    const animatedDensityWrapper = barWrapper.find(AnimatedBarSeries).dive();
    expect(animatedDensityWrapper.find(NodeGroup).length).toBe(1);
  });

  test('it should render one <Bar/> per numeric bin', () => {
    // resonance doesn't compute data without mounting
    const wrapper = mount(
      <Histogram {...histogramProps}>
        <BarSeries animated binnedData={numericBinnedData} />
      </Histogram>,
    );

    setTimeout(() => {
      expect(wrapper.find(Bar).length).toBe(numericBinnedData.length);
    }, 0);
  });

  test('it should render one <Bar/> per categorical bin', () => {
    // resonance doesn't compute data without mounting
    const wrapper = mount(
      <Histogram {...histogramProps} binType="categorical">
        <BarSeries animated binnedData={categoricalBinnedData} />
      </Histogram>,
    );

    setTimeout(() => {
      expect(wrapper.find(Bar).length).toBe(categoricalBinnedData.length);
    }, 0);
  });

  test('it should call onMouseMove({ datum, data, event, color }) and onMouseLeave() on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = mount(
      <Histogram {...histogramProps} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <BarSeries
          animated
          binnedData={numericBinnedData}
          fill="cabbage-purple"
          onClick={onClick}
        />
      </Histogram>,
    );

    setTimeout(() => {
      const bar = wrapper.find(Bar).first();
      bar.simulate('mousemove');

      expect(onMouseMove).toHaveBeenCalledTimes(1);
      let args = onMouseMove.mock.calls[0][0];
      expect(args.data).toBe(numericBinnedData);
      expect(args.datum).toBe(numericBinnedData[0]);
      expect(args.event).toBeDefined();
      expect(args.index).toBe(0);
      expect(args.color).toBe('cabbage-purple');

      bar.simulate('click');
      expect(onClick).toHaveBeenCalledTimes(1);
      args = onClick.mock.calls[0][0];
      expect(args.data).toBe(numericBinnedData);
      expect(args.datum).toBe(numericBinnedData[0]);
      expect(args.event).toBeDefined();
      expect(args.index).toBe(0);
      expect(args.color).toBe('cabbage-purple');

      bar.simulate('mouseleave');
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    }, 0);
  });
});
