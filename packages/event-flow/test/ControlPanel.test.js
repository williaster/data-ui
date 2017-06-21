import React from 'react';
import { shallow } from 'enzyme';
import { Button, Select, StepIncrementer } from '@data-ui/forms';

import ControlPanel from '../src/components/ControlPanel';
import { scales } from '../src/fixtures/testFixtures';
import { ELAPSED_TIME_SCALE, NODE_COLOR_SCALE, EVENT_COUNT_SCALE } from '../src/constants';

describe('<ControlPanel />', () => {
  const props = {
    alignByIndex: 0,
    alignByEventType: 'ANY_EVENT_TYPE',
    orderBy: 'EVENT_COUNT',
    colorScale: scales[NODE_COLOR_SCALE],
    xScaleType: ELAPSED_TIME_SCALE,
    yScaleType: EVENT_COUNT_SCALE,
    showControls: true,
  };

  test('it should be defined', () => {
    expect(ControlPanel).toBeDefined();
  });

  test('It should render a Button', () => {
    const wrapper = shallow(<ControlPanel {...props} />);
    expect(wrapper.find(Button).length).toBe(1);
  });

  test('It should render a select for x-axis, y-axis, event alignment, and order by', () => {
    const wrapper = shallow(<ControlPanel {...props} />);
    expect(wrapper.find(Select).length).toBe(4);
  });

  test('It should render a stepper', () => {
    const wrapper = shallow(<ControlPanel {...props} />);
    expect(wrapper.find(StepIncrementer).length).toBe(1);
  });

  test('It should hide controls when showControls=false', () => {
    const wrapper = shallow(<ControlPanel {...props} showControls={false} />);
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Select).length).toBe(0);
    expect(wrapper.find(StepIncrementer).length).toBe(0);
  });
});
