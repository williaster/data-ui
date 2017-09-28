import React from 'react';
import { shallow } from 'enzyme';
import Links from '../../src/chart/Links';
import Link from '../../src/chart/Link';
import defaultGraph from '../data';

describe('<Links />', () => {
  const props = {
    links: defaultGraph.links,
    linkComponent: Link,
  };

  test('it should be defined', () => {
    expect(Links).toBeDefined();
  });

  test('it should render the correct number of Link components', () => {
    const wrapper = shallow(
      <Links {...props} />,
    );
    expect(wrapper.find(Link).length).toBe(defaultGraph.links.length);
  });
});
