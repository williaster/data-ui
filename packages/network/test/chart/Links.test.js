import React from 'react';
import { shallow } from 'enzyme';
import { Link, Links } from '../../src';
import defaultGraph from '../data';

describe('<Links />', () => {
  const props = {
    links: defaultGraph.links,
    linkComponent: Link,
  };

  it('should be defined', () => {
    expect(Links).toBeDefined();
  });

  it('should render the correct number of Link components', () => {
    const wrapper = shallow(<Links {...props} />);
    expect(wrapper.find(Link)).toHaveLength(defaultGraph.links.length);
  });
});
