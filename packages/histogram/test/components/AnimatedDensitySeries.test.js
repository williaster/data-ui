import React from 'react';
import { shallow, mount } from 'enzyme';
import { AreaClosed, LinePath } from '@vx/shape';
import { NodeGroup } from 'react-move';

import { DensitySeries, Histogram } from '../../src/';
import AnimatedDensitySeries from '../../src/series/animated/AnimatedDensitySeries';

describe('<AnimatedDensitySeries />', () => {
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

  test('it should be defined', () => {
    expect(AnimatedDensitySeries).toBeDefined();
  });

  test('it should render a resonance <NodeGroup />', () => {
    const wrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={categoricalBinnedData} />
      </Histogram>,
    );
    const densityWrapper = wrapper.find(DensitySeries).dive();
    const animatedDensityWrapper = densityWrapper.find(AnimatedDensitySeries).dive();
    expect(animatedDensityWrapper.find(NodeGroup).length).toBe(1);
  });

  test('it should render an <AreaClosed /> depending on the showArea prop', () => {
    // resonance doesn't compute data without mounting
    let wrapper = mount(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={categoricalBinnedData} showArea />
      </Histogram>,
    );
    expect(wrapper.find(AreaClosed).length).toBe(1);

    wrapper = mount(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={categoricalBinnedData} showArea={false} />
      </Histogram>,
    );
    expect(wrapper.find(AreaClosed).length).toBe(0);
  });

  test('it should render an <LinePath /> depending on the showLine prop', () => {
    // resonance doesn't compute data without mounting
    let wrapper = mount(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={categoricalBinnedData} showLine />
      </Histogram>,
    );
    expect(wrapper.find(LinePath).length).toBe(1);

    wrapper = shallow(
      <Histogram {...histogramProps}>
        <DensitySeries animated binnedData={categoricalBinnedData} showLine={false} />
      </Histogram>,
    );
    expect(wrapper.find(LinePath).length).toBe(0);
  });
});
