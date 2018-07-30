import React from 'react';
import { shallow } from 'enzyme';
import { Node } from '../../src';
import defaultGraph from '../data';

describe('<Node />', () => {
  const props = {
    node: defaultGraph.nodes[0],
  };

  it('should be defined', () => {
    expect(Node).toBeDefined();
  });

  it('should render a <g>', () => {
    const wrapper = shallow(<Node {...props} />);
    expect(wrapper.find('g')).toHaveLength(1);
  });

  it('should handle mouse events correctly', () => {
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
    const {
      node: { id: expectedId },
    } = props;
    wrapper.find('circle').simulate('click');
    expect(testID).toBe(expectedId);
    testID = 0;
    wrapper.find('circle').simulate('mouseEnter');
    expect(testID).toBe(expectedId);
    testID = 0;
    wrapper.find('circle').simulate('mouseLeave');
    expect(testID).toBe(expectedId);
    testID = 0;
    wrapper.find('circle').simulate('mouseMove');
    expect(testID).toBe(expectedId);
  });
});
