import React from 'react';
import { shallow } from 'enzyme';
import { Label } from '../../src/';

describe('<Label />', () => {
  test('it should be defined', () => {
    expect(Label).toBeDefined();
  });

  test('it should render a text element', () => {
    const wrapper = shallow(<Label />);
    expect(wrapper.type()).toBe('text');
  });
});
