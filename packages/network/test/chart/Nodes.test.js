import React from 'react';
import { shallow } from 'enzyme';
import { Node, Nodes } from '../../src';
import defaultGraph from '../data';

describe('<Nodes />', () => {
  const props = {
    nodes: defaultGraph.nodes,
    nodeComponent: Node,
  };

  it('it should be defined', () => {
    expect(Nodes).toBeDefined();
  });

  it('it should render the correct number of Node components', () => {
    const wrapper = shallow(<Nodes {...props} />);
    expect(wrapper.find(Node)).toHaveLength(defaultGraph.nodes.length);
  });
});
