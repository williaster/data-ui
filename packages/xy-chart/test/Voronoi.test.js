import React from 'react';
import { shallow, mount } from 'enzyme';

import VoronoiPolygon from '@vx/voronoi/build/components/VoronoiPolygon';

import Voronoi from '../src/chart/Voronoi';

describe('<Voronoi />', () => {
  const props = {
    x: d => d.y,
    y: d => d.x,
    width: 100,
    height: 100,
    data: [
      { x: 20, y: 20 },
      { x: 90, y: 50 },
      { x: 0, y: 80 },
    ],
  };

  test('it should be defined', () => {
    expect(Voronoi).toBeDefined();
  });

  test('it should render one voronoi polygon per point', () => {
    const wrapper = shallow(<Voronoi {...props} />);
    expect(wrapper.find(VoronoiPolygon).length).toBe(props.data.length);
  });

  test('it should pass the relevant datum to onMouseMove on trigger', () => {
    const onMouseMove = jest.fn();
    const wrapper = mount(<Voronoi {...props} onMouseMove={onMouseMove} />);
    const polygon = wrapper.find(VoronoiPolygon).first();
    polygon.simulate('mousemove');

    expect(onMouseMove).toHaveBeenCalledTimes(1);
    const datum = onMouseMove.mock.calls[0][0].datum;
    expect(props.data.includes(datum)).toBe(true);
  });

  test('it should call onMouseLeave on trigger', () => {
    const onMouseLeave = jest.fn();
    const wrapper = mount(<Voronoi {...props} onMouseLeave={onMouseLeave} />);
    const polygon = wrapper.find(VoronoiPolygon).first();
    polygon.simulate('mouseleave');

    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  test('it should update its voronoi if the data update', () => {
    const wrapper = shallow(<Voronoi {...props} />);
    const voronoi0 = wrapper.state('voronoi');

    wrapper.setProps({ data: [{ x: 90, y: 50 }] });
    const voronoi1 = wrapper.state('voronoi');

    expect(voronoi0).toEqual(expect.any(Object));
    expect(voronoi1).toEqual(expect.any(Object));
    expect(voronoi0).not.toEqual(voronoi1);
  });
});
