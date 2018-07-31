import React from 'react';
import { shallow } from 'enzyme';
import {
  BarSeries,
  DensitySeries,
  Histogram,
  histogramPropTypes,
  WithTooltip,
  XAxis,
  YAxis,
} from '../../src';

describe('<Histogram />', () => {
  const props = {
    ariaLabel: 'Histogram of ...',
    width: 200,
    height: 200,
  };

  const rawData = [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];

  it('should be defined', () => {
    expect(Histogram).toBeDefined();
  });

  it('histogramPropTypes should be defined', () => {
    expect(histogramPropTypes).toBeDefined();
  });

  it('should render an svg', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find('svg')).toHaveLength(1);
  });

  it('should render a <WithTooltip /> if renderTooltip is passed', () => {
    let wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(WithTooltip)).toHaveLength(0);

    wrapper = shallow(
      <Histogram {...props} renderTooltip={() => {}}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(WithTooltip)).toHaveLength(1);
  });

  it('should render BarSeries, DensitySeries, XAxis, and YAxis children', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
        <BarSeries rawData={rawData} />
        <DensitySeries rawData={rawData} />
        <XAxis />
        <YAxis />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries)).toHaveLength(2);
    expect(wrapper.find(DensitySeries)).toHaveLength(1);
    expect(wrapper.find(XAxis)).toHaveLength(1);
    expect(wrapper.find(YAxis)).toHaveLength(1);
  });

  it('should pass binScale and valueScale props to children', () => {
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

  it('should set valueKey = `count` for non-normalized non-cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props}>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('count');
  });

  it('should set valueKey = `cumulative` for non-normalized cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} cumulative>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('cumulative');
  });

  it('should set valueKey = `density` for normalized non-cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} normalized>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('density');
  });

  it('should set valueKey = `cumulativeDensity` for normalized cumulative histograms', () => {
    const wrapper = shallow(
      <Histogram {...props} cumulative normalized>
        <BarSeries rawData={rawData} />
      </Histogram>,
    );
    expect(wrapper.find(BarSeries).prop('valueKey')).toBe('cumulativeDensity');
  });
});
