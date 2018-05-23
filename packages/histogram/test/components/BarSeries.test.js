import React from 'react';
import { shallow, mount } from 'enzyme';
import { Bar } from '@vx/shape';
import { BarSeries, Histogram } from '../../src/';
import AnimatedBarSeries from '../../src/series/animated/AnimatedBarSeries';

describe('<BarSeries />', () => {
  const histogramProps = {
    ariaLabel: 'Histogram of ...',
    width: 200,
    height: 200,
  };

  const numericBinnedData = [
    { bin0: 0, bin1: 1, count: 1, id: '0' },
    { bin0: 1, bin1: 2, count: 4, id: '1' },
    { bin0: 2, bin1: 3, count: 6, id: '2' },
    { bin0: 3, bin1: 4, count: 2, id: '3' },
    { bin0: 4, bin1: 5, count: 10, id: '4' },
  ];

  const categoricalBinnedData = [
    { bin: 'a', count: 1, id: 'a' },
    { bin: 'b', count: 4, id: 'b' },
    { bin: 'c', count: 6, id: 'c' },
    { bin: 'd', count: 2, id: 'd' },
    { bin: 'e', count: 10, id: 'e' },
  ];

  test('it should be defined', () => {
    expect(BarSeries).toBeDefined();
  });

  test('it should render one <Bar/> for each numeric bin', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps}>
        <BarSeries animated={false} binnedData={numericBinnedData} />
      </Histogram>,
    );
    const barWrapper = wrapper.find(BarSeries).dive();
    expect(barWrapper.find(Bar).length).toBe(numericBinnedData.length);
  });

  test('it should render one <Bar/> for each categorical bin', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps} binType="categorical">
        <BarSeries animated={false} binnedData={categoricalBinnedData} />
      </Histogram>,
    );
    const barWrapper = wrapper.find(BarSeries).dive();
    expect(barWrapper.find(Bar).length).toBe(numericBinnedData.length);
  });

  test('it should render an <AnimatedBarSeries /> if animated = true', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps}>
        <BarSeries animated binnedData={numericBinnedData} />
      </Histogram>,
    );
    const barWrapper = wrapper.find(BarSeries).dive();
    expect(barWrapper.find(AnimatedBarSeries).length).toBe(1);
  });

  test('it should call onMouseMove(), onClick() and onMouseLeave() on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();
    const onClick = jest.fn();

    const wrapper = mount(
      <Histogram {...histogramProps} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <BarSeries
          animated={false}
          binnedData={numericBinnedData}
          fill="cabbage-purple"
          onClick={onClick}
        />
      </Histogram>,
    );

    const bar = wrapper.find(Bar).first();
    bar.simulate('mousemove');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    let args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBe(numericBinnedData);
    expect(args.datum).toBe(numericBinnedData[0]);
    expect(args.event).toBeDefined();
    expect(args.index).toBe(0);
    expect(args.color).toBe('cabbage-purple');

    bar.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    bar.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    args = onClick.mock.calls[0][0];
    expect(args.data).toBe(numericBinnedData);
    expect(args.datum).toBe(numericBinnedData[0]);
    expect(args.event).toBeDefined();
    expect(args.index).toBe(0);
    expect(args.color).toBe('cabbage-purple');
  });
});
