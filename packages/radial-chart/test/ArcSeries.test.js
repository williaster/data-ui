import React from 'react';
import { mount } from 'enzyme';
import { Arc } from '@vx/shape';
import { ArcSeries } from '../src';

describe('<ArcSeries />', () => {
  test('it should be defined', () => {
    expect(ArcSeries).toBeDefined();
  });

  test('it should render an Arc', () => {
    const wrapper = mount(
      <ArcSeries
        pieValue={d => d.value}
        data={[{ value: 10 }, { value: 5 }]}
        label={null}
      />,
    );
    expect(wrapper.find(Arc).length).toBe(1);
  });

  test('it should render an Arc for slices and an Arc for Labels', () => {
    const wrapper = mount(
      <ArcSeries
        pieValue={d => d.value}
        data={[{ value: 10 }, { value: 5 }]}
        label={() => '!!!'}
      />,
    );
    expect(wrapper.find(Arc).length).toBe(2);
  });

  test('it should pass arc objects to the label accessor and use the output of the accessor', () => {
    const wrapper = mount(
      <ArcSeries
        pieValue={d => d.value}
        data={[{ value: 10 }, { value: 5 }]}
        labelComponent={<text className="test" />}
        label={arc => arc.data.value}
      />,
    );
    const labels = wrapper.find('.test');
    expect(labels.length).toBe(2);
    expect(labels.first().text()).toBe('10');
    expect(labels.last().text()).toBe('5');
  });
});
