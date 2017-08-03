import React from 'react';
import { shallow } from 'enzyme';
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
    { bin0: 0, bin1: 1, count: 1 },
    { bin0: 1, bin1: 2, count: 4 },
    { bin0: 2, bin1: 3, count: 6 },
    { bin0: 3, bin1: 4, count: 2 },
    { bin0: 4, bin1: 5, count: 10 },
  ];

  const categoricalBinnedData = [
    { bin: 'a', count: 1 },
    { bin: 'b', count: 4 },
    { bin: 'c', count: 6 },
    { bin: 'd', count: 2 },
    { bin: 'e', count: 10 },
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
});
