import React from 'react';
import { shallow, mount } from 'enzyme';
import { Network, WithTooltip, Nodes, Links } from '../../src';
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

  test('it should show initial status of rendering', () => {
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('text').length).toBe(1);
  });

  test('it should render the graph for animation enabled graph with little delay', (done) => {
    expect.assertions(2);
    const wrapper = mount(<Network {...props} animated />);
    setTimeout(() => {
      expect(wrapper.find(Nodes).length).toBe(1);
      expect(wrapper.find(Links).length).toBe(1);
      done();
    }, 10);
  });

  test('it should handle mouse events correctly', (done) => {
    expect.assertions(3);

    const expectedId = props.graph.nodes[0].id;
    let testID = null;

    function onMouseEvent({ id }) {
      testID = id;
    }

    const wrapper = mount(
      <Network
        onNodeMouseLeave={onMouseEvent}
        onNodeMouseEnter={onMouseEvent}
        onNodeClick={onMouseEvent}
        {...props}
        animated
      />,
    );

    setTimeout(() => {
      const node = wrapper.find('circle').first();
      node.simulate('click');
      expect(testID).toBe(expectedId);

      testID = null;
      node.simulate('mouseEnter');
      expect(testID).toBe(expectedId);

      testID = null;
      node.simulate('mouseLeave');
      expect(testID).toBe(expectedId);

      done();
    }, 50);
  });
});
