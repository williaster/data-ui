import React from 'react';
import { shallow } from 'enzyme';
import Link from '../../src/chart/Link';
import { defaultGraph } from '../data';

describe('<Link />', () => {
  const props = {
    link: defaultGraph.nodes[0],
  };

  test('it should be defined', () => {
    expect(Link).toBeDefined();
  });

  test('it should render a line dom', () => {
    const wrapper = shallow(
      <Link {...props} />,
    );
    expect(wrapper.find('line').length).toBe(1);
  });
});
