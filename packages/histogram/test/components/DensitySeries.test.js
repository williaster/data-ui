import React from 'react';
import { shallow } from 'enzyme';
import { AreaClosed, LinePath } from '@vx/shape';
import { DensitySeries, Histogram } from '../../src';
import AnimatedDensitySeries from '../../src/series/animated/AnimatedDensitySeries';

describe('<DensitySeries />', () => {
  const histogramProps = {
    ariaLabel: 'Histogram of ...',
    width: 200,
    height: 200,
  };

  const rawNumericData = [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
  const rawCategoricalData = ['a', 'b', 'b', 'c', 'c', 'c'];

  const numericBinnedData = [
    { bin0: 0, bin1: 1, count: 1, id: '0' },
    { bin0: 1, bin1: 2, count: 4, id: '1' },
    { bin0: 2, bin1: 3, count: 6, id: '2' },
    { bin0: 3, bin1: 4, count: 2, id: '3' },
    { bin0: 4, bin1: 5, count: 10, id: '4' },
  ];

  const categoricalBinnedData = [
    { bin: 'a', count: 1, id: '0' },
    { bin: 'b', count: 4, id: '1' },
    { bin: 'c', count: 6, id: '2' },
    { bin: 'd', count: 2, id: '3' },
    { bin: 'e', count: 10, id: '4' },
  ];

  it('should be defined', () => {
    expect(DensitySeries).toBeDefined();
  });

  it('should render a <DensitySeries /> for binned categorical or numeric data', () => {
    const numericWrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={numericBinnedData} showArea />
      </Histogram>,
    );
    const numericDensityWrapper = numericWrapper.find(DensitySeries).dive();
    expect(numericDensityWrapper.find(AreaClosed)).toHaveLength(1);

    const categoricalWrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={categoricalBinnedData} showArea />
      </Histogram>,
    );
    const catetegoricalDensityWrapper = categoricalWrapper.find(DensitySeries).dive();
    expect(catetegoricalDensityWrapper.find(AreaClosed)).toHaveLength(1);
  });

  it('should render a <DensitySeries /> for raw categorical or numeric data', () => {
    const numericWrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} rawData={rawNumericData} showArea />
      </Histogram>,
    );
    const numericDensityWrapper = numericWrapper.find(DensitySeries).dive();
    expect(numericDensityWrapper.find(AreaClosed)).toHaveLength(1);

    const categoricalWrapper = shallow(
      <Histogram {...histogramProps} binType="categorical">
        <DensitySeries animated={false} rawData={rawCategoricalData} showArea />
      </Histogram>,
    );
    const catetegoricalDensityWrapper = categoricalWrapper.find(DensitySeries).dive();
    expect(catetegoricalDensityWrapper.find(AreaClosed)).toHaveLength(1);
  });

  it('should render an <AreaClosed /> depending on the showArea prop', () => {
    const wrapperWithArea = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={numericBinnedData} showArea />
      </Histogram>,
    );
    const densityWithArea = wrapperWithArea.find(DensitySeries).dive();
    expect(densityWithArea.find(AreaClosed)).toHaveLength(1);

    const wrapperWithoutArea = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={numericBinnedData} showArea={false} />
      </Histogram>,
    );
    const densityWithoutArea = wrapperWithoutArea.find(DensitySeries).dive();
    expect(densityWithoutArea.find(AreaClosed)).toHaveLength(0);
  });

  it('should render an <LinePath /> depending on the showLine prop', () => {
    const wrapperWithLine = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={numericBinnedData} showLine />
      </Histogram>,
    );
    const densityWithLine = wrapperWithLine.find(DensitySeries).dive();
    expect(densityWithLine.find(LinePath)).toHaveLength(1);

    const wrapperWithoutLine = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated={false} binnedData={numericBinnedData} showLine={false} />
      </Histogram>,
    );
    const densityWithoutLine = wrapperWithoutLine.find(DensitySeries).dive();
    expect(densityWithoutLine.find(LinePath)).toHaveLength(0);
  });

  it('should render an <AnimatedDensitySeries /> if animated = true', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={numericBinnedData} />
      </Histogram>,
    );
    const densityWrapper = wrapper.find(DensitySeries).dive();
    expect(densityWrapper.find(AnimatedDensitySeries)).toHaveLength(1);
  });
});
