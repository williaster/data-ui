import React from 'react';
import { shallow } from 'enzyme';
import { BarSeries, DensitySeries, Histogram, XAxis, YAxis } from '../../src/';

describe('<Histogram />', () => {
  const props = {
    ariaLabel: 'Histogram of ...',
    width: 200,
    height: 200,
  };

  const rawData = [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];

  test('it should be defined', () => {
    expect(Histogram).toBeDefined();
  });

  test('it should render an svg', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find('svg').length).toBe(1);
  });

  test('it should render BarSeries, DensitySeries, XAxis, and YAxis children', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
        <BarSeries rawData={rawData} />
        <DensitySeries rawData={rawData} />
        <XAxis />
        <YAxis />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).length).toBe(2);
    expect(wrapper.find(DensitySeries).length).toBe(1);
    expect(wrapper.find(XAxis).length).toBe(1);
    expect(wrapper.find(YAxis).length).toBe(1);
  });

  test('it should pass binScale and valueScale props to children', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
        <DensitySeries rawData={rawData} />
      </Histogram>,
    );

    const valueScale = wrapper.state('valueScale');
    const binScale = wrapper.state('binScale');

    expect(wrapper.find(BarSeries).prop('valueScale')).toBe(valueScale);
    expect(wrapper.find(BarSeries).prop('binScale')).toBe(binScale);

    expect(wrapper.find(DensitySeries).prop('valueScale')).toBe(valueScale);
    expect(wrapper.find(DensitySeries).prop('binScale')).toBe(binScale);
  });

  test('it should set valueKey = `count` for non-normalized non-cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('count');
  });

  test('it should set valueKey = `cumulative` for non-normalized cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} cumulative>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('cumulative');
  });

  test('it should set valueKey = `density` for normalized non-cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} normalized>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('density');
  });

  test('it should set valueKey = `cumulativeDensity` for normalized cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} cumulative normalized>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('cumulativeDensity');
  });
});
