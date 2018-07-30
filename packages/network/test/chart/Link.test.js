import React from 'react';
import { shallow } from 'enzyme';
import { Link } from '../../src';
import defaultGraph from '../data';

describe('<Link />', () => {
  const props = {
    link: defaultGraph.nodes[0],
  };

  it('should be defined', () => {
    expect(Link).toBeDefined();
  });

  it('should render a line dom', () => {
    const wrapper = shallow(<Link {...props} />);
    expect(wrapper.find('line')).toHaveLength(1);
  });
});
