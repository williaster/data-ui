import React from 'react';
import { mount } from 'enzyme';
import { scaleLinear } from '@vx/scale';

import { Brush } from '../../src';

describe('<Brush />', () => {
  const props = {
    xScale: scaleLinear({
      domain: [0, 100],
      range: [0, 100],
    }),
    yScale: scaleLinear({
      domain: [0, 100],
      range: [100, 0],
    }),
    innerHeight: 100,
    innerWidth: 100,
  };

  const startEvent = { clientX: 0, clientY: 0 };
  const moveEvent = { clientX: 10, clientY: 40 };
  const endEvent = { clientX: 20, clientY: 60 };
  const clickEvent = { clientX: 60, clientY: 60 };

  function setup(extraProps) {
    return (
      <svg width="200" height="200">
        <Brush {...props} {...extraProps} />
      </svg>
    );
  }

  function simulateFullDrag(target) {
    const dragControlLayer = target.find('.vx-bar .vx-brush-overlay');
    dragControlLayer.simulate('mousedown', startEvent);
    dragControlLayer.simulate('mousemove', moveEvent);
    dragControlLayer.simulate('mouseup', endEvent);
  }

  it('should be defined', () => {
    expect(Brush).toBeDefined();
  });

  it('should trigger onBrushStart function when mouse down', () => {
    const brushStartFn = jest.fn();
    const wrapper = mount(setup({ onBrushStart: brushStartFn }));
    const dragControlLayer = wrapper.find('.vx-bar .vx-brush-overlay');
    dragControlLayer.simulate('mousedown');
    expect(brushStartFn).toHaveBeenCalledTimes(1);
  });

  it('should trigger onChange function when brush moves', () => {
    const changeFn = jest.fn();
    const wrapper = mount(setup({ onChange: changeFn }));
    const dragControlLayer = wrapper.find('.vx-bar .vx-brush-overlay');
    dragControlLayer.simulate('mousedown', startEvent);
    expect(changeFn).toHaveBeenCalledTimes(1);
    dragControlLayer.simulate('mousemove', moveEvent);
    expect(changeFn).toHaveBeenCalledTimes(2);
  });

  it('should trigger onBrushEnd function when mouse up', () => {
    const brushEndFn = jest.fn();
    const wrapper = mount(setup({ onBrushEnd: brushEndFn }));
    simulateFullDrag(wrapper);
    expect(brushEndFn).toHaveBeenCalledTimes(1);
  });

  it('should render selection rectangle after brushing', () => {
    const wrapper = mount(setup());
    simulateFullDrag(wrapper);
    expect(wrapper.find('.vx-brush-selection')).toHaveLength(1);
  });

  it('should remove selection rectangle after click outside selection area', () => {
    const wrapper = mount(setup());
    const dragControlLayer = wrapper.find('.vx-bar .vx-brush-overlay');
    simulateFullDrag(wrapper);
    expect(wrapper.find('.vx-brush-selection')).toHaveLength(1);
    dragControlLayer.simulate('click', clickEvent);
    expect(wrapper.find('.vx-brush-selection')).toHaveLength(1);
  });

  it('should render resize handlers correctly', () => {
    const resizeTriggerAreas = [
      'left',
      'right',
      'top',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
    ];
    const wrapper = mount(setup({ resizeTriggerAreas }));
    simulateFullDrag(wrapper);
    resizeTriggerAreas.forEach(handle => {
      expect(wrapper.find(`.vx-brush-handle-${handle}`)).toHaveLength(1);
    });
  });
});
