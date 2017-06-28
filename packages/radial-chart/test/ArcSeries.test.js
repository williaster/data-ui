import React from 'react';
import { shallow } from 'enzyme';
import { Arc } from '@vx/shape';
import { RadialChart, ArcSeries } from '../src';

describe('<ArcSeries />', () => {
  const mockProps = {
    ariaLabel: 'This is a pie chart of ...',
    width: 100,
    height: 100,
  };

  test('it should be defined', () => {
    expect(RadialChart).toBeDefined();
  });

  test('it should render an Arc', () => {
    const wrapper = shallow(
      <RadialChart {...mockProps}>
        <ArcSeries data={[{ value: 10 }, { value: 5 }]} />
      </RadialChart>,
    );
    expect(wrapper.dive().find(Arc).length).toBe(1);
  });
});
