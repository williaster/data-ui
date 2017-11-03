import React from 'react';
import { shallow } from 'enzyme';
import { curveCardinal, curveLinear, curveBasis, curveMonotoneX } from '@vx/curve';
import Group from '@vx/group/build/Group';
import LinePath from '@vx/shape/build/shapes/LinePath';
import AreaClosed from '@vx/shape/build/shapes/AreaClosed';
import { Sparkline, LineSeries } from '../../src/';

describe('<LineSeries />', () => {
  const sparklineProps = {
    ariaLabel: 'test',
    width: 100,
    height: 100,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    data: Array(10).fill().map((_, i) => i),
  };

  test('it should be defined', () => {
    expect(LineSeries).toBeDefined();
  });

  test('it should render null if no accessors or scales are passed', () => {
    expect(shallow(<LineSeries />).type()).toBeNull();
  });

  test('it should render an AreaClosed if showArea is true', () => {
    let wrapper = shallow(
      <Sparkline {...sparklineProps}><LineSeries showArea /></Sparkline>,
    ).find(LineSeries).dive();

    expect(wrapper.find(AreaClosed).length).toBe(1);

    wrapper = shallow(
      <Sparkline {...sparklineProps}><LineSeries showArea={false} /></Sparkline>,
    ).find(LineSeries).dive();

    expect(wrapper.find(AreaClosed).length).toBe(0);
  });

  test('it should render an LinePath if showLine is true and strokeWidth > 0', () => {
    let wrapper = shallow(
      <Sparkline {...sparklineProps}><LineSeries showLine /></Sparkline>,
    ).find(LineSeries).dive();
    expect(wrapper.find(LinePath).length).toBe(1);

    wrapper = shallow(
      <Sparkline {...sparklineProps}><LineSeries showLine={false} /></Sparkline>,
    ).find(LineSeries).dive();
    expect(wrapper.find(LinePath).length).toBe(0);
  });

  test('it should use the curve specified by the curve prop', () => {
    const curves = {
      linear: curveLinear,
      basis: curveBasis,
      cardinal: curveCardinal,
      monotoneX: curveMonotoneX,
    };

    Object.keys(curves).forEach((curve) => {
      const wrapper = shallow(
        <Sparkline {...sparklineProps}>
          <LineSeries showLine showArea curve={curve} />
        </Sparkline>,
      ).find(LineSeries).dive();

      expect(wrapper.find(AreaClosed).prop('curve')).toEqual(curves[curve]);
      expect(wrapper.find(LinePath).prop('curve')).toEqual(curves[curve]);
    });

    const assertionPerCurve = 2;
    expect.assertions(Object.keys(curves).length * assertionPerCurve);
  });

  test.only('it should call onMouseMove({ datum, data, index, event, color }) and onMouseLeave() on trigger', () => {
    const onMouseMove = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = shallow(
      <Sparkline {...sparklineProps}>
        <LineSeries
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
      </Sparkline>,
    ).find(LineSeries).dive();

    const group = wrapper.find(Group);
    group.simulate('mousemove', {});
    group.simulate('mouseleave', {});
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    const args = onMouseMove.mock.calls[0][0];
    expect(args.data).toBeDefined();
    expect(args.datum).toBeUndefined();
    expect(args.event).toBeDefined();
    expect(args.color).toBeDefined();
    expect(args.index).toBeUndefined();
  });
});
