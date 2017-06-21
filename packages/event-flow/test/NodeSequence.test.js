import React from 'react';
import { shallow } from 'enzyme';

import NodeSequence from '../src/components/NodeSequence';

import { buildGraph } from '../src/utils/graph-utils';
import { buildAllScales } from '../src/utils/scale-utils';
import { TS, EVENT_NAME, ENTITY_ID } from '../src/constants';

describe('<NodeSequence />', () => {
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
  const nodeArray = Object.values(graph.nodes).sort((a, b) => a.depth - b.depth);

  const props = {
    nodeArray,
    separator: '!!',
    colorScale: scales.NODE_COLOR_SCALE,
  };

  test('it should be defined', () => {
    expect(NodeSequence).toBeDefined();
  });

  test('it should render one span element per node', () => {
    const wrapper = shallow(<NodeSequence {...props} />);
    expect(wrapper.children().length).toBe(nodeArray.length);
  });

  test('it should add colors using the color scale', () => {
    const colorScale = props.colorScale;
    const wrapper = shallow(<NodeSequence {...props} />);
    const children = wrapper.children();
    children.forEach((child, index) => {
      const node = props.nodeArray[index];
      const color = child.find('span').last().props().style.color;
      const expectedColor = colorScale.scale(colorScale.accessor(node));
      expect(color).toBe(expectedColor);
    });
  });
});
