import React from 'react';
import { shallow } from 'enzyme';
import Node from '../../src/chart/Node';
import defaultGraph from '../data';

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

  test('it should handle mouse events correctly', () => {
    let testID = 0;
    function onMouseEvent({ id }) {
      testID = id;
    }
    const wrapper = shallow(
      <Node
        onMouseMove={onMouseEvent}
        onMouseLeave={onMouseEvent}
        onMouseEnter={onMouseEvent}
        onClick={onMouseEvent}
        {...props}
      />,
    );
    wrapper.find('circle').simulate('click');
    expect(testID).toBe(props.node.id);
    testID = 0;
    wrapper.find('circle').simulate('mouseEnter');
    expect(testID).toBe(props.node.id);
    testID = 0;
    wrapper.find('circle').simulate('mouseLeave');
    expect(testID).toBe(props.node.id);
    testID = 0;
    wrapper.find('circle').simulate('mouseMove');
    expect(testID).toBe(props.node.id);
  });
});
