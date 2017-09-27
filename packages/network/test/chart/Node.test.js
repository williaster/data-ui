import React from 'react';
import { shallow } from 'enzyme';
import Node from '../../src/chart/Node';
import { defaultGraph } from '../data';

describe('<Node />', () => {
  const props = {
    node: defaultGraph.nodes[0],
  };

  test('it should be defined', () => {
    expect(Node).toBeDefined();
  });

  test('it should render a <g> dom', () => {
    const wrapper = shallow(
      <Node {...props} />,
    );
    expect(wrapper.find('g').length).toBe(1);
  });
});
