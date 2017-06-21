import React from 'react';
import { shallow } from 'enzyme';
import { scaleLinear, scaleOrdinal } from '@vx/scale';

import AggregatePanel from '../src/components/AggregatePanel';
import SubTree from '../src/components/SubTree';
import XAxis from '../src/components/XAxis';
import YAxis from '../src/components/YAxis';
import ZeroLine from '../src/components/ZeroLine';

import { buildGraph } from '../src/utils/graph-utils';
import { buildAllScales } from '../src/utils/scale-utils';
import { TS, EVENT_NAME, ENTITY_ID } from '../src/constants';


describe('<AggregatePanel />', () => {
  const events = [
    { [TS]: new Date('2017-03-22 18:33:10'), [EVENT_NAME]: 'a', [ENTITY_ID]: 'u1' },
    { [TS]: new Date('2017-03-22 18:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u1' },
    { [TS]: new Date('2017-03-22 18:35:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u1' },
    { [TS]: new Date('2017-03-22 18:36:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u1' },
  ];

  const width = 500;
  const height = 500;

  const graph = buildGraph(events);
  const scales = buildAllScales(graph, width, height);

  const props = {
    xScale: scales.ELAPSED_TIME_SCALE,
    yScale: scales.EVENT_COUNT_SCALE,
    timeScale: scales.ELAPSED_TIME_SCALE,
    colorScale: scales.NODE_COLOR_SCALE,
    nodeSorter: () => -1,
    width,
    height,
    graph,
  };

  test('it should be defined', () => {
    expect(AggregatePanel).toBeDefined();
  });

  test('it should render an svg', () => {
    const wrapper = shallow(<AggregatePanel {...props} />);
    expect(wrapper.find('svg').length).toBe(1);
  });

  test('it should render an XAxis', () => {
    const wrapper = shallow(<AggregatePanel {...props} />);
    expect(wrapper.find(XAxis).length).toBe(1);
  });

  test('it should render an YAxis', () => {
    const wrapper = shallow(<AggregatePanel {...props} />);
    expect(wrapper.find(YAxis).length).toBe(1);
  });

  test('it should render a ZeroLine', () => {
    const wrapper = shallow(<AggregatePanel {...props} />);
    expect(wrapper.find(ZeroLine).length).toBe(1);
  });

  test('it should render a SubTree', () => {
    const wrapper = shallow(<AggregatePanel {...props} />);
    expect(wrapper.find(SubTree).length).toBe(1);
  });
});
