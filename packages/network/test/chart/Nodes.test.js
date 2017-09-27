import React from 'react';
import { shallow } from 'enzyme';
import Nodes from '../../src/chart/Nodes';
import Node from '../../src/chart/Node';
import { defaultGraph } from '../data';

describe('<Links />', () => {
  const props = {
    nodes: defaultGraph.nodes,
    nodeComponent: Node,
  };

  test('it should be defined', () => {
    expect(Nodes).toBeDefined();
  });

  test('it should render the correct number of Link components', () => {
    const wrapper = shallow(
      <Nodes {...props} />,
    );
    expect(wrapper.find(Node).length).toBe(defaultGraph.nodes.length);
  });
});
