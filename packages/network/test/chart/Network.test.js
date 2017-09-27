import React from 'react';
import { shallow, mount } from 'enzyme';
import { Network, WithTooltip } from '../../src';
import Nodes from '../../src/chart/Nodes';
import Links from '../../src/chart/Links';
import defaultGraph from '../data';

describe('<Network />', () => {
  const props = {
    ariaLabel: 'test',
    height: 100,
    width: 100,
    graph: defaultGraph,
  };

  test('it should be defined', () => {
    expect(Network).toBeDefined();
  });

  test('it should render a <WithTooltip />', () => {
    const wrapper = shallow(
      <Network {...props} renderTooltip={() => {}} />,
    );
    expect(wrapper.find(WithTooltip).length).toBe(1);
  });

  test('it should render an svg', () => {
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('svg').length).toBe(1);
  });

  test('it should render Nodes and Links', () => {
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find(Nodes).length).toBe(1);
    expect(wrapper.find(Links).length).toBe(1);
  });

  test('it should handle mouse events correctly', () => {
    let testID = 0;
    function onMouseEvent({ id }) {
      testID = id;
    }
    const wrapper = mount(
      <Network
        onNodeMouseLeave={onMouseEvent}
        onNodeMouseEnter={onMouseEvent}
        onNodeClick={onMouseEvent}
        {...props}
      />,
    );
    wrapper.find('circle').first().simulate('click');
    expect(testID).toBe(props.graph.nodes[0].id);
    testID = 0;
    wrapper.find('circle').first().simulate('mouseEnter');
    expect(testID).toBe(props.graph.nodes[0].id);
    testID = 0;
    wrapper.find('circle').first().simulate('mouseLeave');
    expect(testID).toBe(props.graph.nodes[0].id);
  });
});
